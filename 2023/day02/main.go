package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	f, err := os.Open("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	var part1 int
	var part2 int

	for scanner.Scan() {

		line := scanner.Text()

		colon := strings.Index(line, ":")
		space := strings.Index(line, " ") + 1

		id, _ := strconv.Atoi(line[space:colon])

		line = line[colon+1:]

		cubeMapList := cubeMapList(line)

		if PossibleGame(cubeMapList) {
			part1 += id
		}

		part2 += Power(cubeMapList)

	}

	fmt.Println(part1)
	fmt.Println(part2)
}

func cubeMapList(line string) []map[string]int {

	game := strings.Split(line, ";")

	res := []map[string]int{}

	for _, v := range game {
		cubesInDraw := strings.Split(v, ",")
		cubeDrawMap := map[string]int{}
		for _, cube := range cubesInDraw {
			numberColorPair := strings.Split(cube, " ")
			cubeDrawMap[numberColorPair[2]], _ = strconv.Atoi(numberColorPair[1])
		}
		res = append(res, cubeDrawMap)
	}

	return res

}

func PossibleGame(cubeMapList []map[string]int) bool {
	for _, d := range cubeMapList {
		if d["green"] > 13 || d["red"] > 12 || d["blue"] > 14 {
			return false
		}
	}
	return true
}

// Definitely a cleaner way of doing this
func Power(cubeMapList []map[string]int) int {
	var red int
	var green int
	var blue int

	for _, draw := range cubeMapList {
		if draw["green"] > green {
			green = draw["green"]
		}
		if draw["blue"] > blue {
			blue = draw["blue"]
		}
		if draw["red"] > red {
			red = draw["red"]
		}
	}

	return red * green * blue
}
