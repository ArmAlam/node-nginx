package models

type Task struct {
	Number    int64                  `json:"number"`
	Headers   map[string]interface{} `json:"headers"`
	Timestamp int64                  `json:"timestamp"`
}

type Result struct {
	OriginalNumber int64  `json:"originalNumber"`
	PrimeCount     int64  `json:"primeCount"`
	ProcessedAt    string `json:"processedAt"`
}
