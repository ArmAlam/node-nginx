package main

import (
	"go-worker/consumer"
	"go-worker/utils"
)

func main() {
	utils.Init()
	utils.InfoLogger.Println("Go Worker Service Started 🚀")

	conn := utils.ConnectWithRetry("amqp://user:pass@rabbitmq:5672/", 10)
	defer conn.Close()

	ch, err := conn.Channel()
	utils.FailOnError(err, "Channel open error")
	defer ch.Close()

	consumer.StartConsuming(ch)
}
