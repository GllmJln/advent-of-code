package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

type star struct {
	adjacentNumbers []*number
}

type number struct {
	start int
	end   int
	value int
	i     int
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	input := []string{}

	for scanner.Scan() {
		input = append(input, scanner.Text()+".")
	}

	part1 := part1(input)

	fmt.Println(part1)

	part2 := part2(input)

	fmt.Println(part2)
}

func part1(input []string) int {
	var total int

	for i, line := range input {
		var number string
		var valid bool
		for j, c := range line {
			_, err := strconv.Atoi(string(c))

			if err != nil {
				if valid {
					n, _ := strconv.Atoi(number)
					total += n
					valid = false
				}
				number = ""
				continue
			}

			number += string(c)

			if valid {
				continue
			}

			if j > 0 && Symbol(input[i][j-1]) {
				valid = true
			}

			if i > 0 && Symbol(input[i-1][j]) {
				valid = true
			}

			if i < len(input)-1 && Symbol(input[i+1][j]) {
				valid = true
			}

			if j < len(line)-1 && Symbol(input[i][j+1]) {
				valid = true
			}

			if i > 0 && j > 0 && Symbol(input[i-1][j-1]) {
				valid = true
			}

			if i < len(input)-1 && j > 0 && Symbol(input[i+1][j-1]) {
				valid = true
			}

			if i > 0 && j < len(line)-1 && Symbol(input[i-1][j+1]) {
				valid = true
			}

			if i < len(input)-1 && j < len(line)-1 && Symbol(input[i+1][j+1]) {
				valid = true
			}

		}
	}

	return total
}

func part2(input []string) int {
	var total int

	for i, line := range input {
		for j, c := range line {

			if string(c) != "*" {
				continue
			}

			s := star{}

			if j > 0 && isNumber(input[i][j-1]) {
				s.AddNumber(i, j-1, input)
			}

			if i > 0 && isNumber(input[i-1][j]) {
				s.AddNumber(i-1, j, input)
			}

			if i < len(input)-1 && isNumber(input[i+1][j]) {
				s.AddNumber(i+1, j, input)
			}

			if j < len(line)-1 && isNumber(input[i][j+1]) {
				s.AddNumber(i, j+1, input)
			}

			if i > 0 && j > 0 && isNumber(input[i-1][j-1]) {
				s.AddNumber(i-1, j-1, input)
			}

			if i < len(input)-1 && j > 0 && isNumber(input[i+1][j-1]) {
				s.AddNumber(i+1, j-1, input)
			}

			if i > 0 && j < len(line)-1 && isNumber(input[i-1][j+1]) {
				s.AddNumber(i-1, j+1, input)
			}

			if i < len(input)-1 && j < len(line)-1 && isNumber(input[i+1][j+1]) {
				s.AddNumber(i+1, j+1, input)
			}

			if len(s.adjacentNumbers) == 2 {
				number1, number2 := s.adjacentNumbers[0].value, s.adjacentNumbers[1].value
				total += number1 * number2
			}

		}
	}

	return total
}

func (s *star) AddNumber(i, j int, input []string) {
	number := &number{}

	number.Grow(i, j, input)

	for _, n := range s.adjacentNumbers {
		if n.start == number.start && n.end == number.end && n.i == number.i {
			return
		}
	}

	s.adjacentNumbers = append(s.adjacentNumbers, number)
}

func (n *number) Grow(i, j int, input []string) {
	offsetLeft, left := n.growLeft(i, j, input)
	offsetRight, right := n.growRight(i, j, input)

	n.value, _ = strconv.Atoi(left + right[1:])

	n.start = j - offsetLeft + 1
	n.end = j + offsetRight - 1
	n.i = i

}

func (n *number) growLeft(i, j int, input []string) (int, string) {
	var res string
	var err error
	var offset int

	for err == nil {

		res = string(input[i][j-offset]) + res
		offset++
		if j-offset < 0 {
			break
		}
		_, err = strconv.Atoi(string(input[i][j-offset]))
	}

	return offset, res

}

func (n *number) growRight(i, j int, input []string) (int, string) {
	var res string
	var err error
	var offset int

	for err == nil {

		res += string(input[i][j+offset])
		offset++
		if j+offset >= len(input[i]) {
			break
		}
		_, err = strconv.Atoi(string(input[i][j+offset]))
	}

	return offset, res

}

func Symbol(i byte) bool {
	_, err := strconv.Atoi(string(i))

	_ = err

	return string(i) != "." && err != nil
}

func isNumber(i byte) bool {
	_, err := strconv.Atoi(string(i))

	return err == nil
}
