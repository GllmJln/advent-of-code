package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

type Pair struct {
	left  string
	right string
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	pairs := map[string]*Pair{}
	var instructions string

	var index int
	for scanner.Scan() {
		line := scanner.Text()

		if line == "" {
			continue
		}

		if index == 0 {
			instructions = line
			index++
			continue
		}

		line = strings.Replace(line, "= (", "", 1)
		line = strings.Replace(line, ",", "", 1)
		line = strings.Replace(line, ")", "", 1)
		inputs := strings.Split(line, " ")

		pair := &Pair{
			inputs[1],
			inputs[2],
		}

		pairs[inputs[0]] = pair

	}

	part1Func := func(pos string) bool { return pos != "ZZZ" }

	part1 := Walk("AAA", part1Func, pairs, instructions)

	fmt.Println(part1)

	periodicities := []int{}

	part2Func := func(pos string) bool { return !strings.HasSuffix(pos, "Z") }

	for k := range pairs {
		if strings.HasSuffix(k, "A") {
			period := Walk(k, part2Func, pairs, instructions)
			periodicities = append(periodicities, period)
		}
	}

	fmt.Println(lcm(periodicities...)) // 13385272668829

}

func Walk(start string, end func(string) bool, pairs map[string]*Pair, instructions string) int {
	position := start
	steps := 0

	for end(position) {
		nextMove := instructions[steps%len(instructions)]
		if nextMove == 'R' {
			position = pairs[position].right
		} else {
			position = pairs[position].left
		}
		steps++
	}
	return steps
}

func lcm(ints ...int) int { // definitely did not google that
	res := (ints[0] * ints[1]) / gcd(ints[0], ints[1])

	for i := 2; i < len(ints); i++ {
		res = lcm(res, ints[i])
	}

	return res
}

func gcd(a, b int) int {
	if b == 0 {
		return a
	}

	return gcd(b, a%b)
}
