const std = @import("std");

pub fn main() !void {
    const input = @embedFile("input.txt");

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    const allocator = gpa.allocator();

    const puzzle = try Puzzle.init(allocator, input);
    defer puzzle.deinit();

    part1(puzzle);
    part2(puzzle);
}

const Puzzle = struct {
    allocator: std.mem.Allocator,
    rows: std.ArrayList([]const u8),

    fn init(allocator: std.mem.Allocator, input: []const u8) !Puzzle {
        var iterator = std.mem.splitScalar(u8, input, '\n');

        var rows = std.ArrayList([]const u8).init(allocator);
        errdefer rows.deinit();

        while (iterator.next()) |row| {
            try rows.append(row);
        }

        return .{
            .allocator = allocator,
            .rows = rows,
        };
    }

    fn deinit(puzzle: Puzzle) void {
        puzzle.rows.deinit();
    }
};

fn part1(puzzle: Puzzle) void {
    const valid_moves = [_]*const [2]i32{
        &[2]i32{ -1, -1 },
        &[2]i32{ 1, 1 },
        &[2]i32{ 1, -1 },
        &[2]i32{ -1, 1 },
        &[2]i32{ 0, -1 },
        &[2]i32{ 0, 1 },
        &[2]i32{ -1, 0 },
        &[2]i32{ 1, 0 },
    };

    const order = "XMAS";

    var found: i32 = 0;

    for (puzzle.rows.items, 0..) |row, y| {
        for (row, 0..) |char, x| {
            if (char != order[0]) {
                continue;
            }

            for (valid_moves) |move| {
                var currX: i32 = @intCast(x);
                var currY: i32 = @intCast(y);
                for (order[1..], 1..) |c, i| {
                    currX += @intCast(move[0]);
                    currY += @intCast(move[1]);

                    if (currX < 0 or currX >= row.len) {
                        break;
                    }

                    if (currY < 0 or currY >= puzzle.rows.items.len) {
                        break;
                    }

                    if (puzzle.rows.items[@intCast(currY)][@intCast(currX)] != c) {
                        break;
                    }

                    if (i == order[1..].len) {
                        found += 1;
                    }
                }
            }
        }
    }

    std.debug.print("part 1: {d}\n", .{found});
}

fn part2(puzzle: Puzzle) void {
    const valid_moves = [_]*const [2]i32{
        &[2]i32{ -1, -1 },
        &[2]i32{ 1, 1 },
        &[2]i32{ 1, -1 },
        &[2]i32{ -1, 1 },
    };

    var found: i32 = 0;

    for (puzzle.rows.items, 0..) |row, y| {
        for (row, 0..) |char, x| {
            if (char != 'A') {
                continue;
            }

            var last: u8 = 0;

            for (valid_moves, 0..) |move, i| {
                var currX: i32 = @intCast(x);
                currX += move[0];
                var currY: i32 = @intCast(y);
                currY += @intCast(move[1]);

                if (currX < 0 or currX >= row.len) {
                    break;
                }

                if (currY < 0 or currY >= puzzle.rows.items.len) {
                    break;
                }

                const currentChar = puzzle.rows.items[@intCast(currY)][@intCast(currX)];

                if (currentChar != 'M' and currentChar != 'S') {
                    break;
                }

                if (i % 2 == 0) {
                    last = currentChar;
                } else if (currentChar == last) {
                    break;
                } else if (i == valid_moves.len - 1) {
                    found += 1;
                }
            }
        }
    }

    std.debug.print("part 2: {d}\n", .{found});
}
