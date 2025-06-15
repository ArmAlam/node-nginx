package processor

import "math"

func IsPrime(n int64) bool {
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

func CountPrimes(n int64) int64 {
	var count int64 = 0
	for i := int64(2); i <= n; i++ {
		if IsPrime(i) {
			count++
		}
	}
	return count
}
