package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
)

type Galaxy struct {
	i       int
	j       int
	iScaled int
	jScaled int
	dist    map[*Galaxy]int
}

type Puzzle struct {
	galaxies []*Galaxy
	lines    []string
}

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(f)

	lines := []string{}

	for scanner.Scan() {
		line := scanner.Text()

		lines = append(lines, line)

	}

	lines = MarkEmpty(lines)
	lines = transpose(lines)
	lines = MarkEmpty(lines)
	lines = transpose(lines)

	puzzle := Puzzle{
		galaxies: make([]*Galaxy, 0),
		lines:    lines,
	}

	for i, l := range lines {
		for j, c := range l {
			if c == '#' {
				puzzle.galaxies = append(puzzle.galaxies, &Galaxy{
					i:    i,
					j:    j,
					dist: map[*Galaxy]int{},
				})
			}
		}
	}

	// Did do a minor refactor after submission to use the "scaled" thing everywhere
	puzzle.ScaleEmpty(2)
	res := puzzle.FindAllPaths()
	fmt.Println(res)

	puzzle.ScaleEmpty(1_000_000)
	res = puzzle.FindAllPaths()
	fmt.Println(res)
}

func (p *Puzzle) ScaleEmpty(factor int) {
	for _, g := range p.galaxies {
		g.dist = map[*Galaxy]int{}
		g.iScaled = (factor-1)*EmptyRowsFrom(p.lines, g.i) + g.i - 1
		g.jScaled = (factor-1)*EmptyColumnsFrom(p.lines, g.j) + g.j - 1
	}

}

func EmptyColumnsFrom(lines []string, j int) int {
	var total int
	for k := j; k > -1; k-- {
		if lines[0][k] == 'R' {
			total++
		}
	}
	return total
}

func EmptyRowsFrom(lines []string, i int) int {
	var total int
	for k := i; k > -1; k-- {
		if lines[k][0] == 'R' {
			total++
		}
	}
	return total
}

func (p *Puzzle) FindAllPaths() int {
	var total int
	for _, g := range p.galaxies {
		for _, t := range p.galaxies {
			if t.iScaled == g.iScaled && t.jScaled == g.jScaled {
				continue
			}
			if _, ok := g.dist[t]; ok {
				continue
			}
			dist := g.PathFind(t.iScaled, t.jScaled)
			t.dist[g] = dist
			g.dist[t] = dist
			total += dist
		}
	}
	return total
}

func (g *Galaxy) PathFind(i, j int) int {
	xdiff := int(math.Abs(float64(g.iScaled - i)))
	ydiff := int(math.Abs(float64(g.jScaled - j)))

	return xdiff + ydiff

}

func MarkEmpty(lines []string) []string {
	for i := range lines {
		if allMatch(lines[i], '.') {
			lines[i] = "R" + lines[i][1:]
		}
	}
	return lines
}

func allMatch(str string, match rune) bool {
	for _, c := range str {
		if c != match {
			return false
		}
	}
	return true
}

func transpose(slice []string) []string {
	result := []string{}

	for i := range slice[0] {
		var line string
		for j := range slice {
			line += string(slice[j][i])
		}
		result = append(result, line)
	}
	return result
}
