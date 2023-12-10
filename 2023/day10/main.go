package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

var moves = map[string][][]int{
	"|": {{-1, 0}, {1, 0}},
	"-": {{0, -1}, {0, 1}},
	"L": {{-1, 0}, {0, 1}},
	"J": {{-1, 0}, {0, -1}},
	"7": {{1, 0}, {0, -1}},
	"F": {{1, 0}, {0, 1}},
	".": {},
	"S": {{-1, 0}, {0, 1}},
}

var replace = map[string][]string{
	".": {"...", ".R.", "..."},
	" ": {"...", "...", "..."},
	"|": {".#.", ".#.", ".#."},
	"-": {"...", "###", "..."},
	"L": {".#.", ".##", "..."},
	"S": {".#.", ".##", "..."},
	"J": {".#.", "##.", "..."},
	"7": {"...", "##.", ".#."},
	"F": {"...", ".##", ".#."},
}

type coord struct {
	value   string
	visited bool
	i       int
	j       int
}

type Map struct {
	grid           [][]*coord
	startingCoords []*coord
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	grid := [][]*coord{}
	var i int

	for scanner.Scan() {
		line := "." + scanner.Text() + "."

		s := strings.Split(line, "")
		coords := []*coord{}

		for j, c := range s {
			coords = append(coords, &coord{value: c, visited: false, i: i, j: j})
		}

		grid = append(grid, coords)
		i++
	}

	puzzleMap := Map{grid: grid}

	puzzleMap.startingPosition()

	fmt.Println(puzzleMap.FurthestPoint())

	puzzleMap.RemoveNonVisited()
	puzzleMap.Expand()
	puzzleMap.FloodFill()

	fmt.Println(puzzleMap.CountStr("R"))

}

func (m *Map) CountStr(str string) int {
	var total int
	for _, l := range m.grid {
		for _, k := range l {
			if k.value == str {
				total++
			}
		}
	}
	return total
}

func (m *Map) RemoveNonVisited() {
	for _, l := range m.grid {
		for _, c := range l {
			if !c.visited {
				c.value = "."
			}
		}
	}
}

func (m *Map) Expand() {
	newGrid := [][]*coord{}
	for _, l := range m.grid {
		block := map[int][]*coord{
			1: {},
			2: {},
			3: {},
		}

		for _, c := range l {
			for i := 0; i < 3; i++ {
				for j := 0; j < 3; j++ {
					block[i] = append(block[i],
						&coord{
							value:   string(replace[c.value][i][j]),
							visited: false,
						})
				}
			}
		}
		for i := 0; i < 3; i++ {
			newGrid = append(newGrid, block[i])
		}
	}

	// Probably a way, to do this in above loop, this is easier
	for i, l := range newGrid {
		for j, c := range l {
			c.i = i
			c.j = j
		}
	}

	m.grid = newGrid
}

// This is VERY helpful
func (m *Map) PrintGrid() {
	lines := [][]string{}
	for _, l := range m.grid {
		line := []string{}
		for _, c := range l {
			line = append(line, c.value)
		}
		lines = append(lines, line)
	}

	for _, l := range lines {
		fmt.Println(strings.Join(l, ""))
	}
}

func (m *Map) startingPosition() {
	for _, l := range m.grid {
		for _, c := range l {
			if c.value == "S" {
				c.visited = true
				m.startingCoords = []*coord{c}
			}
		}
	}
}

func (m *Map) FurthestPoint() int {
	stepsInLoop := 0
	for {
		nextMoves := []*coord{}
		for _, c := range m.startingCoords {
			validMoves := moves[c.value]
			for _, mv := range validMoves {
				next := m.grid[c.i+mv[0]][c.j+mv[1]]

				if !next.visited {
					next.visited = true
					nextMoves = append(nextMoves, next)
				}

			}

		}
		if len(nextMoves) == 0 {
			break
		}
		m.startingCoords = nextMoves
		stepsInLoop++
	}
	return stepsInLoop
}

func (m *Map) FloodFill() {
	m.startingCoords = []*coord{m.grid[0][0]}
	validMoves := [][]int{
		{0, 1},
		{0, -1},
		{1, 0},
		{-1, 0},
	}

	nextMoves := m.startingCoords

	for len(nextMoves) != 0 {
		nextMoves = []*coord{}
		for _, c := range m.startingCoords {
			for _, mv := range validMoves {
				if c.i+mv[0] < 0 || c.i+mv[0] > len(m.grid)-1 || c.j+mv[1] < 0 || c.j+mv[1] > len(m.grid[0])-1 {
					continue
				}

				next := m.grid[c.i+mv[0]][c.j+mv[1]]
				c.value = " "

				if !next.visited && (next.value == "." || next.value == "R") {
					next.visited = true
					nextMoves = append(nextMoves, next)
				}
			}
		}
		m.startingCoords = nextMoves
	}
}
