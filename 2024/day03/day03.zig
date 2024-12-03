const std = @import("std");

pub fn main() !void {
    const input = @embedFile("input.txt");

    var part1Instructions: [1][]const u8 = .{"mul("};

    const part1 = try calculate(input, &part1Instructions);

    std.debug.print("part 1: {d}\n", .{part1});

    var part2Instructions: [3][]const u8 = .{ "mul(", "do()", "don't()" };

    const part2 = try calculate(input, &part2Instructions);

    std.debug.print("part 2: {d}\n", .{part2});
}

fn calculate(input: []const u8, instructionSet: [][]const u8) !i32 {
    var result: i32 = 0;
    var do = true;

    var i: usize = 0;
    OUTER: while (i < input.len - 1) {
        var instructionIdx: ?i32 = null;

        INSTRUCTIONS: for (instructionSet, 0..) |instruction, idx| {
            for (instruction, 0..) |c, j| {
                if (input[i] != c) {
                    i -= j;
                    continue :INSTRUCTIONS;
                }
                i += 1;
            }
            instructionIdx = @intCast(idx);
        }

        if (instructionIdx == null) {
            i += 1;
            continue;
        }

        switch (instructionIdx.?) {
            1...2 => {
                do = instructionIdx == 1;
                continue;
            },
            0 => {
                if (!do) {
                    continue;
                }
            },
            else => {
                std.debug.panic("unexpected instructionIdx {any}", .{instructionIdx});
            },
        }

        var total: i32 = 1;

        const breakChars = [2]u8{ ',', ')' };

        for (breakChars) |breakChar| {
            var loopTotal: i32 = 0;
            while (true) {
                // 1brc coming in useful
                if (input[i] >= '0' and input[i] <= '9') {
                    loopTotal = loopTotal * 10 + input[i] - '0';
                    i += 1;
                    continue;
                }

                if (input[i] == breakChar) {
                    i += 1;
                    total *= loopTotal;
                    break;
                }

                i += 1;
                continue :OUTER;
            }
        }

        result += total;
    }

    return result;
}
