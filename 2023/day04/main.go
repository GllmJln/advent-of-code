package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

type card struct {
	id   string
	wins []string
}

type cardSet struct {
	cardCounts map[string]int
	cards      map[string]*card
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	part1Total := 0

	part2CardSet := &cardSet{
		cardCounts: make(map[string]int),
		cards:      make(map[string]*card),
	}

	for scanner.Scan() {

		line := scanner.Text()

		part1Total += part1(line)

		card := NewCard(line)

		part2CardSet.cardCounts[card.id] = 1
		part2CardSet.cards[card.id] = card

	}

	fmt.Println(part1Total)
	fmt.Println(part2CardSet.TotalCards())
}

func part1(line string) int {
	card := strings.Split(line, ":")[1]

	winningNumbers := strings.Split(strings.Split(card, "|")[0], " ")

	winning := map[string]any{}

	for _, v := range winningNumbers {
		if v != "" {
			winning[v] = nil
		}
	}

	haveNumbers := strings.Split(strings.Split(card, "|")[1], " ")

	m := matches(winning, haveNumbers)

	var cardPoints int

	if m > 0 {
		cardPoints = int(math.Pow(2, float64(m)-1))
	}

	return cardPoints
}

func NewCard(line string) *card {

	c := strings.Split(line, ":")[1]

	winningNumbers := strings.Split(strings.Split(c, "|")[0], " ")

	winning := map[string]any{}

	for _, v := range winningNumbers {
		if v != "" {
			winning[v] = nil
		}
	}

	haveNumbers := strings.Split(strings.Split(c, "|")[1], " ")
	splitPrefix := strings.Split(strings.Split(line, ":")[0], " ")
	id := splitPrefix[len(splitPrefix)-1]
	return &card{
		id:   id,
		wins: nextN(id, matches(winning, haveNumbers)),
	}
}

func nextN(start string, n int) []string {
	startInt, _ := strconv.Atoi(start)
	res := make([]string, n)

	for i := 0; i < n; i++ {
		res[i] = strconv.Itoa(startInt + i + 1)
	}

	return res
}

func matches(winning map[string]any, have []string) int {
	var matches int
	for _, v := range have {
		if _, ok := winning[v]; ok {
			matches++
		}
	}

	return matches
}

func (c *cardSet) TotalCards() int {
	// range over a map is evaluated in random order
	for i := 1; i < len(c.cardCounts); i++ {
		k := strconv.Itoa(i)
		v := c.cardCounts[k]
		for _, card := range c.cards[k].wins {
			c.cardCounts[card] += v
		}
	}

	var total int
	for _, v := range c.cardCounts {
		total += v
	}

	return total
}
