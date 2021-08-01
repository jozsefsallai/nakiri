package utils

import (
	"strings"

	"github.com/iancoleman/strcase"
)

type CamelCaseReplacer struct {
}

func (c CamelCaseReplacer) replaceExtra(s string) string {
	replacer := strings.NewReplacer("ID", "Id", "URL", "Url")
	return replacer.Replace(s)
}

// Replace will replace a string with its camelCase equivalent.
func (c CamelCaseReplacer) Replace(s string) string {
	return c.replaceExtra(strcase.ToLowerCamel(s))
}
