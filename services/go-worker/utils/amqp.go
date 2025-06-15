package utils

import (
	"log"
	"time"

	"github.com/streadway/amqp"
)

func ConnectWithRetry(url string, maxRetries int) *amqp.Connection {
	var conn *amqp.Connection
	var err error

	for i := 1; i <= maxRetries; i++ {
		conn, err = amqp.Dial(url)
		if err == nil {
			log.Printf("Connected to RabbitMQ on attempt %d\n", i)
			return conn
		}
		log.Printf("Retry %d: %v", i, err)
		time.Sleep(3 * time.Second)
	}
	log.Fatalf("Failed to connect: %v", err)
	return nil
}

func FailOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
