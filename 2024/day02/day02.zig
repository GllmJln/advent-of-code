const std = @import("std");

pub fn main() !void {
    var file = try std.fs.cwd().openFile("input.txt", .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    const allocator = gpa.allocator();

    var part1: i32 = 0;
    var part2: i32 = 0;

    var buf: [100]u8 = undefined;

    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var arr = std.ArrayList(i32).init(allocator);
        defer arr.deinit();

        var split = std.mem.splitScalar(u8, line, ' ');

        while (split.next()) |field| {
            const fieldInt = try std.fmt.parseInt(i32, field, 10);
            try arr.append(fieldInt);
        }

        if (try valid(arr.items)) {
            part1 += 1;
        }

        if (try solvePart2(allocator, arr.items)) {
            part2 += 1;
        }
    }

    std.debug.print("part 1: {d}\n", .{part1});
    std.debug.print("part 2: {d}\n", .{part2});
}

fn valid(line: []i32) !bool {
    var increasing: ?bool = null;

    for (line, 0..) |field, i| {
        if (i == 0) {
            continue;
        }

        const last = line[i - 1];

        if (@abs(last - field) > 3 or last == field) {
            return false;
        }

        if (increasing == null) {
            increasing = last < field;
            continue;
        }

        if (increasing != (last < field)) {
            return false;
        }
    }

    return true;
}

fn solvePart2(alloc: std.mem.Allocator, line: []i32) !bool {
    if (try valid(line)) {
        return true;
    }

    for (1..line.len + 1) |i| {
        var subArray = std.ArrayList(i32).init(alloc);
        defer subArray.deinit();

        try subArray.appendSlice(line[0 .. i - 1]);
        try subArray.appendSlice(line[i..line.len]);

        if (try valid(subArray.items)) {
            return true;
        }
    }

    return false;
}
