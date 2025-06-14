package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/streadway/amqp"
)

type Task struct {
	User      map[string]interface{} `json:"user"`
	Headers   map[string]interface{} `json:"headers"`
	Timestamp int64                  `json:"timestamp"`
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
			log.Printf("✅ Connected to RabbitMQ on attempt %d\n", i)
			return conn
		}

		log.Printf("⏳ Attempt %d: RabbitMQ not ready, retrying in %v... Error: %v\n", i, delay, err)
		time.Sleep(delay)
	}

	log.Fatalf("Could not connect to RabbitMQ after %d attempts: %v", maxRetries, err)
	return nil
}

func main() {
	rabbitURL := "amqp://user:pass@rabbitmq:5672/"
	conn := connectWithRetry(rabbitURL, 10, 3*time.Second)
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare("tasks", true, false, false, false, nil)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name,
		"go-worker", // consumer tag
		true,        // auto-ack
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")

	log.Println("🚀 Waiting for messages...")

	for d := range msgs {
		var task Task
		err := json.Unmarshal(d.Body, &task)
		if err != nil {
			log.Println("Error parsing task:", err)
			continue
		}

		fmt.Printf("📥 Received task: %+v\n", task)
	}
}
