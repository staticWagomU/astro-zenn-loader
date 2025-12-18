import { describe, expect, it } from "vitest";
import { buildFeedUrl, enclosureSchema, zennItemSchema } from "./index";

describe("buildFeedUrl", () => {
	it("should build correct feed URL for a given username", () => {
		const url = buildFeedUrl("testuser");
		expect(url).toBe("https://zenn.dev/testuser/feed?all=1");
	});

	it("should handle usernames with special characters", () => {
		const url = buildFeedUrl("user-name_123");
		expect(url).toBe("https://zenn.dev/user-name_123/feed?all=1");
	});
});

describe("enclosureSchema", () => {
	it("should parse valid enclosure data", () => {
		const validData = {
			url: "https://example.com/image.png",
			length: 12345,
			type: "image/png",
		};

		const result = enclosureSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it("should transform string length to number", () => {
		const dataWithStringLength = {
			url: "https://example.com/image.png",
			length: "12345",
			type: "image/png",
		};

		const result = enclosureSchema.parse(dataWithStringLength);
		expect(result.length).toBe(12345);
		expect(typeof result.length).toBe("number");
	});

	it("should reject invalid URL", () => {
		const invalidData = {
			url: "not-a-valid-url",
			length: 12345,
			type: "image/png",
		};

		expect(() => enclosureSchema.parse(invalidData)).toThrow();
	});

	it("should reject missing required fields", () => {
		const incompleteData = {
			url: "https://example.com/image.png",
		};

		expect(() => enclosureSchema.parse(incompleteData)).toThrow();
	});
});

describe("zennItemSchema", () => {
	const validZennItem = {
		creator: "testuser",
		title: "Test Article Title",
		link: "https://zenn.dev/testuser/articles/test-article",
		pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
		enclosure: {
			url: "https://example.com/image.png",
			length: 12345,
			type: "image/png",
		},
		"dc:creator": "testuser",
		content: "<p>Article content here</p>",
		contentSnippet: "Article content here",
		guid: "https://zenn.dev/testuser/articles/test-article",
		isoDate: "2024-01-01T00:00:00.000Z",
	};

	it("should parse valid Zenn item", () => {
		const result = zennItemSchema.parse(validZennItem);
		expect(result).toEqual({
			...validZennItem,
			enclosure: {
				...validZennItem.enclosure,
				length: 12345,
			},
		});
	});

	it("should reject item with missing title", () => {
		const { title, ...itemWithoutTitle } = validZennItem;
		expect(() => zennItemSchema.parse(itemWithoutTitle)).toThrow();
	});

	it("should reject item with invalid link URL", () => {
		const itemWithInvalidLink = {
			...validZennItem,
			link: "not-a-url",
		};
		expect(() => zennItemSchema.parse(itemWithInvalidLink)).toThrow();
	});

	it("should reject item with invalid isoDate", () => {
		const itemWithInvalidDate = {
			...validZennItem,
			isoDate: "not-a-date",
		};
		expect(() => zennItemSchema.parse(itemWithInvalidDate)).toThrow();
	});

	it("should reject item with missing enclosure", () => {
		const { enclosure, ...itemWithoutEnclosure } = validZennItem;
		expect(() => zennItemSchema.parse(itemWithoutEnclosure)).toThrow();
	});
});
