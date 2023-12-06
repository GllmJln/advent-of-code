package main

import "fmt"

type race struct {
	time           int
	recordDistance int
}

func main() {
	part1 := 1

	races := []race{
		{44, 277},
		{89, 1136},
		{96, 1890},
		{91, 1768},
	}

	for _, r := range races {
		part1 *= r.Solve()
	}

	fmt.Println(part1)

	part2 := race{44899691, 277113618901768}

	fmt.Println(part2.Part2())

}

func (r *race) Solve() int {
	var res int
	for i := 0; i <= r.time; i++ {
		dist := i * (r.time - i)
		if dist > r.recordDistance {
			res++
		}
	}
	return res
}

func (r *race) Part2() int {
	up := make(chan int)
	down := make(chan int)

	go r.up(up)
	go r.down(down)

	upDist, downDist := <-up, <-down

	return downDist - upDist + 1
}

func (r *race) down(res chan int) {
	i := r.time
	for {
		dist := i * (r.time - i)
		if dist > r.recordDistance {
			break
		}
		i--
	}

	res <- i

}

func (r *race) up(res chan int) {
	i := 0
	for {
		dist := i * (r.time - i)
		if dist > r.recordDistance {
			break
		}
		i++
	}

	res <- i

}
