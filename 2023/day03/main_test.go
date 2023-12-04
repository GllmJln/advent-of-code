package main

import (
	"fmt"
	"testing"
)

func TestGrow(t *testing.T) {

	number := number{}
	expected := 5678910

	input := []string{fmt.Sprintf(".%d.....", expected)}

	number.Grow(0, 7, input)

	if number.value != expected {
		t.Errorf("Expected %d, got %d", expected, number.value)
	}

	if number.start != 1 {
		t.Errorf("Invalid start expected %d, got %d", 1, number.start)
	}

	if number.end != 7 {
		t.Errorf("Invalid end expeted %d, got %d", 7, number.end)
	}

}
