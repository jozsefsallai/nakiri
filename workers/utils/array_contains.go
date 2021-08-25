package utils

func ArrayContainsString(array []string, item string) bool {
	for _, a := range array {
		if a == item {
			return true
		}
	}
	return false
}
