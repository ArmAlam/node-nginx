package main

import (
	"encoding/json"
	"log"
	"math"
	"time"

	"github.com/streadway/amqp"
)

type Task struct {
	Number    int64                  `json:"number"`
	Headers   map[string]interface{} `json:"headers"`
	Timestamp int64                  `json:"timestamp"`
}

type Result struct {
	OriginalNumber int64 `json:"originalNumber"`
	PrimeCount     int64 `json:"primeCount"`
	ProcessedAt    string `json:"processedAt"`
}

func isPrime(n int64) bool {
	if n < 2 {
		return false
	}
	sqrt := int64(math.Sqrt(float64(n)))
	for i := int64(2); i <= sqrt; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}

func countPrimes(n int64, resultCh chan<- int64) {
	var count int64 = 0
	for i := int64(2); i <= n; i++ {
		if isPrime(i) {
			count++
		}
	}
	resultCh <- count
}

func main() {
	conn := connectWithRetry("amqp://user:pass@rabbitmq:5672/", 10, 3*time.Second)
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Channel open error")
	defer ch.Close()

	tasksQueue, _ := ch.QueueDeclare("tasks", true, false, false, false, nil)
	resultsQueue, _ := ch.QueueDeclare("results", true, false, false, false, nil)

	msgs, err := ch.Consume(tasksQueue.Name, "go-worker", true, false, false, false, nil)
	failOnError(err, "Consumer error")

	log.Println("Waiting for tasks...")

	for msg := range msgs {
		var task Task
		json.Unmarshal(msg.Body, &task)

		log.Printf("Got number to process: %d\n", task.Number)

		resultCh := make(chan int64)
		go countPrimes(task.Number, resultCh)

		primeCount := <-resultCh

		result := Result{
			OriginalNumber: task.Number,
			PrimeCount:     primeCount,
			ProcessedAt:    time.Now().Format(time.RFC3339),
		}
		body, _ := json.Marshal(result)

		err = ch.Publish("", resultsQueue.Name, false, false, amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType: "application/json",
			Body:        body,
		})
		if err == nil {
			log.Printf("Sent result for %d (primes: %d)", task.Number, primeCount)
		}
	}
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func connectWithRetry(url string, maxRetries int, delay time.Duration) *amqp.Connection {
	var conn *amqp.Connection
	var err error

	for i := 1; i <= maxRetries; i++ {
		conn, err = amqp.Dial(url)
		if err == nil {
			log.Printf("Connected to RabbitMQ on attempt %d\n", i)
			return conn
		}
		log.Printf("Retry %d: %v", i, err)
		time.Sleep(delay)
	}
	log.Fatalf("Failed to connect: %v", err)
	return nil
}
