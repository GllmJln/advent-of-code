package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Entry struct {
	key    int
	value  int
	length int
}

type puzzleMap struct {
	entries []Entry
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	seeds := []int{}

	var currMap *puzzleMap

	var maps []*puzzleMap

	for scanner.Scan() {
		line := scanner.Text()

		inputs := strings.Split(line, " ")

		if len(inputs) < 2 {
			continue
		}

		if inputs[0] == "seeds:" {
			seeds, _ = IntArray(inputs[1:])
			continue
		}

		if inputs[1] == "map:" {
			if currMap != nil {
				maps = append(maps, currMap)
				currMap = nil
			}
			continue
		}

		if currMap == nil {
			currMap = &puzzleMap{}
		}

		currMap.AddEntry(inputs[0], inputs[1], inputs[2])

	}

	maps = append(maps, currMap)

	part1 := SolvePart1(seeds, maps)

	fmt.Printf("Part 1: %d\n", part1)

	var minValue int
	var res int

	for {
		res = SolvePart2(minValue, maps)
		if validSeed(res, seeds) {
			break
		}
		minValue++
	}

	fmt.Printf("Part 2: %d\n", minValue)

}

func validSeed(seed int, seeds []int) bool {
	for i := 0; i < len(seeds); i += 2 {
		if seed >= seeds[i] && seed < seeds[i]+seeds[i+1] {
			return true
		}

	}
	return false
}

func SolvePart2(value int, maps []*puzzleMap) int {
	for i := len(maps) - 1; i >= 0; i-- {
		m := maps[i]
		value = m.FindValue(value)
	}

	return value
}

func SolvePart1(input []int, maps []*puzzleMap) int {

	res := make([]int, len(input))

	copy(res, input)

	for _, m := range maps {
		for i, v := range res {
			res[i] = m.Find(v)
		}
	}

	return min(res...)

}

func min(input ...int) int {
	res := input[0]
	for _, v := range input {
		if v < res {
			res = v
		}
	}

	return res
}

func (m *puzzleMap) AddEntry(dest, src, length string) {
	key, _ := strconv.Atoi(src)
	value, _ := strconv.Atoi(dest)
	l, _ := strconv.Atoi(length)

	m.entries = append(m.entries, Entry{key, value, l})
}

func (m *puzzleMap) Find(key int) int {
	for _, e := range m.entries {
		value, ok := e.Key(key)
		if ok {
			return value
		}
	}

	return key
}

func (m *puzzleMap) FindValue(value int) int {
	for _, e := range m.entries {
		key, ok := e.Value(value)
		if ok {
			return key
		}
	}

	return value
}

func (e *Entry) Key(key int) (int, bool) {

	if key >= e.key && key < e.key+e.length {
		return key + (e.value - e.key), true
	}

	return 0, false
}

func (e *Entry) Value(value int) (int, bool) {

	if value >= e.value && value < e.value+e.length {
		return value + (e.key - e.value), true
	}

	return 0, false
}

func IntArray(input []string) ([]int, error) {
	res := make([]int, len(input))

	for i, v := range input {
		n, err := strconv.Atoi(v)

		if err != nil {
			return nil, err
		}

		res[i] = n
	}
	return res, nil
}
