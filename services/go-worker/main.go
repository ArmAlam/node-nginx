package main

import (
	"go-worker/consumer"
	"go-worker/utils"
	"os"
)

func main() {

	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		utils.InfoLogger.Fatalf("RABBITMQ_URL environment variable is required")
	}
	
	utils.Init()
	utils.InfoLogger.Println("Go Worker Service Started")

	
	conn := utils.ConnectWithRetry(rabbitURL, 10)
	defer conn.Close()

	ch, err := conn.Channel()
	utils.FailOnError(err, "Channel open error")
	defer ch.Close()

	consumer.StartConsuming(ch)
}
