package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

var spelled map[string]int = map[string]int{
	"zero":  0,
	"one":   1,
	"two":   2,
	"three": 3,
	"four":  4,
	"five":  5,
	"six":   6,
	"seven": 7,
	"eight": 8,
	"nine":  9,
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	part1 := 0
	part2 := 0

	for scanner.Scan() {
		line := scanner.Text()
		p1first, p1last := first(line, false), last(line, false)
		p2first, p2last := first(line, true), last(line, true)

		p1Number, _ := strconv.Atoi(fmt.Sprintf("%d%d", p1first, p1last))
		p2Number, _ := strconv.Atoi(fmt.Sprintf("%d%d", p2first, p2last))

		part1 += p1Number
		part2 += p2Number

	}

	fmt.Printf("Part 1: %d\n", part1)
	fmt.Printf("Part 2: %d\n", part2)

}

func first(line string, part2 bool) int {
	var read string
	for _, c := range line {
		read += string(c)
		if v, err := strconv.Atoi(string(c)); err == nil {
			return v
		}

		if part2 {
			for k, v := range spelled {
				if strings.Contains(read, k) {
					return v
				}
			}
		}
	}

	return -1
}

func last(line string, part2 bool) int {
	var read string
	for _, c := range Reverse(line) {
		read = string(c) + read
		if v, err := strconv.Atoi(string(c)); err == nil {
			return v
		}

		if part2 {
			for k, v := range spelled {
				if strings.Contains(read, k) {
					return v
				}
			}
		}
	}

	return -1
}

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}
