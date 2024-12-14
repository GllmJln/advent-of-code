const std = @import("std");

pub fn main() !void {
    const input = @embedFile("input.txt");

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    const allocator = gpa.allocator();

    const puzzle = try buildPuzzle(allocator, input);
    defer puzzle.deinit();

    try part1(puzzle);

    try part2(allocator, puzzle);
}

fn part1(puzzle: *Puzzle) !void {
    var total: i32 = 0;

    for (puzzle.valid.items) |row| {
        const middle_page = row.items[row.items.len / 2];
        total += try std.fmt.parseInt(i32, middle_page, 10);
    }

    std.debug.print("part 1: {d}\n", .{total});
}

fn part2(allocator: std.mem.Allocator, puzzle: *Puzzle) !void {
    var total: i32 = 0;

    for (puzzle.invalid.items) |row| {
        OUTER: while (true) {
            var visited = std.ArrayList([]const u8).init(allocator);
            defer visited.deinit();

            for (row.items, 0..) |item, i| {
                const page_rules = puzzle.get(item);

                if (page_rules == null) {
                    try visited.append(item);
                    continue;
                }

                for (visited.items, 0..) |visited_page, j| {
                    for (page_rules.?.after.items) |after| {
                        if (std.mem.eql(u8, visited_page, after.page_number)) {
                            // swap out of order
                            const tmp = row.items[j];
                            row.items[j] = row.items[i];
                            row.items[i] = tmp;

                            continue :OUTER;
                        }
                    }
                }

                try visited.append(item);
            }

            total += try std.fmt.parseInt(i32, visited.items[visited.items.len / 2], 10);
            break;
        }
    }

    std.debug.print("part 2: {d}\n", .{total});
}

fn buildPuzzle(allocator: std.mem.Allocator, input: []const u8) !*Puzzle {
    const delim = "\n\n";

    const idx = std.mem.indexOf(u8, input, delim);

    const pages_order = input[0..idx.?];

    var lines = std.mem.splitScalar(u8, pages_order, '\n');

    const all_updates = input[idx.? + 2 ..];

    var results = try Puzzle.init(allocator, all_updates);

    while (lines.next()) |line| {
        const pipe_idx = std.mem.indexOf(u8, line, "|");

        const leftKey = line[0..pipe_idx.?];
        const rightKey = line[pipe_idx.? + 1 ..];

        var left = results.get(leftKey);
        if (left == null) {
            left = try Page.init(allocator, leftKey);
            try results.put(leftKey, left.?);
        }
        var right = results.get(rightKey);
        if (right == null) {
            right = try Page.init(allocator, rightKey);
            try results.put(rightKey, right.?);
        }

        try left.?.after.append(right.?);
    }

    try results.separateInvalidAndValidUpdates();

    return results;
}

const Puzzle = struct {
    updates: []const u8,
    rulesByPage: std.StringHashMap(*Page),
    allocator: std.mem.Allocator,
    valid: std.ArrayList(std.ArrayList([]const u8)),
    invalid: std.ArrayList(std.ArrayList([]const u8)),

    fn init(allocator: std.mem.Allocator, updates: []const u8) !*Puzzle {
        var puzzle = try allocator.create(Puzzle);

        puzzle.allocator = allocator;
        puzzle.rulesByPage = std.StringHashMap(*Page).init(allocator);
        puzzle.updates = updates;
        puzzle.valid = std.ArrayList(std.ArrayList([]const u8)).init(allocator);
        puzzle.invalid = std.ArrayList(std.ArrayList([]const u8)).init(allocator);

        return puzzle;
    }

    fn deinit(self: *Puzzle) void {
        var values = self.rulesByPage.valueIterator();

        while (values.next()) |value| {
            value.*.deinit();
        }

        self.rulesByPage.deinit();

        for (self.valid.items) |item| {
            item.deinit();
        }

        for (self.invalid.items) |item| {
            item.deinit();
        }

        self.valid.deinit();
        self.invalid.deinit();

        self.allocator.destroy(self);
    }

    fn get(self: *Puzzle, key: []const u8) ?*Page {
        return self.rulesByPage.get(key);
    }

    fn put(self: *Puzzle, key: []const u8, value: *Page) !void {
        try self.rulesByPage.put(key, value);
    }

    fn UpdatesIterator(self: *Puzzle) std.mem.SplitIterator(u8, .scalar) {
        return std.mem.splitScalar(u8, self.updates, '\n');
    }

    fn separateInvalidAndValidUpdates(self: *Puzzle) !void {
        var updates = self.UpdatesIterator();

        while (updates.next()) |update| {
            var visited = std.ArrayList([]const u8).init(self.allocator);

            var valid = true;
            var pages = std.mem.splitScalar(u8, update, ',');

            while (pages.next()) |page| {
                const page_rules = self.get(page);
                if (page_rules == null) {
                    try visited.append(page);
                    continue;
                }

                for (visited.items) |visited_page| {
                    for (page_rules.?.after.items) |after| {
                        if (std.mem.eql(u8, visited_page, after.page_number)) {
                            valid = false;
                        }
                    }
                }

                try visited.append(page);
            }

            if (valid) {
                try self.valid.append(visited);
            } else {
                try self.invalid.append(visited);
            }
        }
    }
};

// Ideally it should be possible to create one array which contains all pages in order
// However I was fighting with Zig trying to do this. Furthermmore, I realised that because of how the updates work it's possible to have scenarios such as:
// A|B
// B|C
// C|A
// as long as C and A are never part of the same update. This way skirts around that problem but is hackier.
const Page = struct {
    after: std.ArrayList(*Page),
    allocator: std.mem.Allocator,
    page_number: []const u8,

    fn init(allocator: std.mem.Allocator, page_number: []const u8) !*Page {
        var page = try allocator.create(Page);
        errdefer allocator.destroy(page);

        page.page_number = page_number;
        page.after = std.ArrayList(*Page).init(allocator);
        page.allocator = allocator;

        return page;
    }

    fn deinit(self: *Page) void {
        self.after.deinit();
        self.allocator.destroy(self);
    }
};
