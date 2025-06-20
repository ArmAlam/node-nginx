package consumer

import (
	"encoding/json"
	"log"
	"time"

	"go-worker/models"
	"go-worker/processor"
	"go-worker/utils"

	"github.com/streadway/amqp"
)

func StartConsuming(ch *amqp.Channel) {
	tasksQueue, err := ch.QueueDeclare("tasks", true, false, false, false, nil)

	if err != nil {
		utils.FailOnError(err, "Failed to declare tasks queue")
	}

	resultsQueue, err := ch.QueueDeclare("results", true, false, false, false, nil)

	if err != nil {
		utils.FailOnError(err, "Failed to declare results queue")
	
	}

	msgs, err := ch.Consume(tasksQueue.Name, "go-worker", true, false, false, false, nil)
	
	if err != nil {
		utils.FailOnError(err, "Consumer failed to register a consumer")
	
	}

	log.Println("Waiting for tasks...")

	for msg := range msgs {
		var task models.Task
		json.Unmarshal(msg.Body, &task)

		log.Printf("Got number to process: %d\n", task.Number)

		primeCount := processor.CountPrimes(task.Number)

		result := models.Result{
			OriginalNumber: task.Number,
			PrimeCount:     primeCount,
			ProcessedAt:    time.Now().Format(time.RFC3339),
		}
		body, _ := json.Marshal(result)

		err = ch.Publish("", resultsQueue.Name, false, false, amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "application/json",
			Body:         body,
		})
		if err == nil {
			log.Printf("Sent result for %d (primes: %d)", task.Number, primeCount)
		}
	}
}
