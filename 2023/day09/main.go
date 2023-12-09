package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Line struct {
	triangle [][]int
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	lines := []*Line{}

	for scanner.Scan() {
		line := NewLine(scanner.Text())
		lines = append(lines, line)
	}

	var part1 int
	var part2 int
	for _, line := range lines {
		line.Triangle()
		line.Extrapolate()
		line.ExtrapolateBack()
		part1 += line.triangle[0][len(line.triangle[0])-1]
		part2 += line.triangle[0][0]
	}

	fmt.Println(part1)
	fmt.Println(part2)

}

func NewLine(line string) *Line {
	numbers := strings.Split(line, " ")

	triangle := make([][]int, 1)

	for _, s := range numbers {
		n, _ := strconv.Atoi(s)
		triangle[0] = append(triangle[0], n)
	}

	return &Line{
		triangle: triangle,
	}
}

func (l *Line) Triangle() {
	for {
		curr := l.triangle[len(l.triangle)-1]
		next := []int{}

		for i, v := range curr {
			if i == len(curr)-1 {
				break
			}

			nextV := curr[i+1] - v
			next = append(next, nextV)
		}

		l.triangle = append(l.triangle, next)
		if allZero(next) {
			break
		}
	}
}

func (l *Line) Extrapolate() {
	for i := len(l.triangle) - 1; i >= 0; i-- {
		if i == len(l.triangle)-1 {
			l.triangle[i] = append(l.triangle[i], 0)
			continue
		}

		prev := l.triangle[i+1]
		val := l.triangle[i][len(l.triangle[i])-1] + prev[len(prev)-1]
		l.triangle[i] = append(l.triangle[i], val)
	}

}

func (l *Line) ExtrapolateBack() {
	for i := len(l.triangle) - 1; i >= 0; i-- {
		if i == len(l.triangle)-1 {
			l.triangle[i] = append([]int{0}, l.triangle[i]...)
			continue
		}

		prev := l.triangle[i+1]
		val := l.triangle[i][0] - prev[0]
		l.triangle[i] = append([]int{val}, l.triangle[i]...)
	}

}

func allZero(ints []int) bool {
	for _, v := range ints {
		if v != 0 {
			return false
		}
	}
	return true
}
