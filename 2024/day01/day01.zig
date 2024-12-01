const std = @import("std");

pub fn main() !void {
    var file = try std.fs.cwd().openFile("input.txt", .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    const allocator = gpa.allocator();

    var left = std.ArrayList(i32).init(allocator);
    defer left.deinit();

    var right = std.ArrayList(i32).init(allocator);
    defer right.deinit();

    var buf: [100]u8 = undefined;
    while (try in_stream.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        const idx = std.mem.indexOf(u8, line, "   ").?;

        const leftInt = try std.fmt.parseInt(i32, line[0..idx], 10);
        try left.append(leftInt);

        const rightInt = try std.fmt.parseInt(i32, line[idx + 3 .. line.len], 10);
        try right.append(rightInt);
    }

    std.mem.sort(i32, left.items, {}, std.sort.asc(i32));
    std.mem.sort(i32, right.items, {}, std.sort.asc(i32));

    // part 1
    {
        var sum: u32 = 0;
        for (left.items, right.items) |leftItem, rightItem| {
            // std.debug.print("{d}   {d}\n", .{ leftItem, rightItem });
            sum += @abs(leftItem - rightItem);
        }

        std.debug.print("part 1: {d}\n", .{sum});
    }

    // part 2
    {
        var score: i32 = 0;
        var last: i32 = 0;
        var rightCount: i32 = 0;

        for (left.items) |leftItem| {
            if (leftItem == last) {
                score += leftItem * rightCount;
                continue;
            }

            rightCount = 0;
            last = leftItem;

            for (right.items) |rightItem| {
                if (rightItem > leftItem) {
                    // sorted
                    break;
                }

                if (rightItem == leftItem) {
                    rightCount += 1;
                }
            }

            score += leftItem * rightCount;
        }

        std.debug.print("part2: {d}\n", .{score});
    }
}
