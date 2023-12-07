package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
)

const (
	fiveOfAKind  = 0
	fourOfAKind  = 1
	fullHouse    = 2
	threeOfAKind = 3
	twoPair      = 4
	onePair      = 5
	highCard     = 6
)

type hand struct {
	Type int
	Bid  int
	Hand string
}

var cardOrder string = "AKQJT98765432"
var cardOrderPart2 string = "AKQT98765432J"

func main() {

	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	hands := []*hand{}

	for scanner.Scan() {
		line := scanner.Text()

		hand := NewHand(line)
		hand.Part1Type()

		hands = append(hands, hand)

	}

	PrintWinnings(hands, cardOrder)

	for _, h := range hands {
		h.Part2Type()
	}

	PrintWinnings(hands, cardOrderPart2)

}

func (h *hand) Part2Type() {
	handCounts := map[rune]int{}

	for _, c := range h.Hand {
		handCounts[c] += 1
	}

	h.Type = TypeWithJoker(handCounts)
}

func (h *hand) Part1Type() {
	handCounts := map[rune]int{}

	for _, c := range h.Hand {
		handCounts[c] += 1
	}

	h.Type = Type(handCounts)

}

func NewHand(line string) *hand {
	inputs := strings.Split(line, " ")

	suits := inputs[0]

	bid, _ := strconv.Atoi(inputs[1])

	h := &hand{
		Bid:  bid,
		Hand: suits,
	}

	return h
}

func TypeWithJoker(counts map[rune]int) int {
	if _, ok := counts[rune('J')]; !ok {
		return Type(counts)
	}

	jokerCount := counts[rune('J')]

	delete(counts, rune('J'))

	maxCount := max(counts)

	counts[maxCount] += jokerCount

	return Type(counts)
}

func max(counts map[rune]int) rune {
	max := 0 // we can use 0 safely here
	var res rune
	for k, v := range counts {
		if v > max {
			max = v
			res = k
		}
	}

	return res
}

func Type(counts map[rune]int) int {

	switch len(counts) {
	case 1:
		return fiveOfAKind
	case 2:
		for _, v := range counts {
			if v == 4 {
				return fourOfAKind
			}
		}
		return fullHouse

	case 3:
		for _, v := range counts {
			if v == 3 {
				return threeOfAKind
			}
		}
		return twoPair
	case 4:
		return onePair
	default:
		return highCard
	}
}

func PrintWinnings(hands []*hand, cardRanks string) {
	sort.Slice(hands, func(i, j int) bool {
		if hands[i].Type != hands[j].Type {
			return hands[i].Type > hands[j].Type
		}

		for k, c := range hands[i].Hand {
			if c != rune(hands[j].Hand[k]) {
				return strings.Index(cardRanks, string(c)) > strings.Index(cardRanks, string(hands[j].Hand[k]))
			}
		}

		return true
	})

	var winnings int

	for i, h := range hands {
		winnings += (i + 1) * h.Bid
	}

	fmt.Println(winnings)
}
