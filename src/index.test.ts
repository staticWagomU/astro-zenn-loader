import { describe, expect, it } from "vitest";
import { buildFeedUrl, enclosureSchema, zennItemSchema } from "./index";

describe("buildFeedUrl関数", () => {
	it("ユーザー名から正しいフィードURLを構築する", () => {
		const url = buildFeedUrl("testuser");
		expect(url).toBe("https://zenn.dev/testuser/feed?all=1");
	});

	it("特殊文字を含むユーザー名を処理できる", () => {
		const url = buildFeedUrl("user-name_123");
		expect(url).toBe("https://zenn.dev/user-name_123/feed?all=1");
	});
});

describe("enclosureスキーマ", () => {
	it("有効なenclosureデータをパースできる", () => {
		const validData = {
			url: "https://example.com/image.png",
			length: 12345,
			type: "image/png",
		};

		const result = enclosureSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it("文字列のlengthを数値に変換する", () => {
		const dataWithStringLength = {
			url: "https://example.com/image.png",
			length: "12345",
			type: "image/png",
		};

		const result = enclosureSchema.parse(dataWithStringLength);
		expect(result.length).toBe(12345);
		expect(typeof result.length).toBe("number");
	});

	it("無効なURLを拒否する", () => {
		const invalidData = {
			url: "not-a-valid-url",
			length: 12345,
			type: "image/png",
		};

		expect(() => enclosureSchema.parse(invalidData)).toThrow();
	});

	it("必須フィールドが欠けている場合は拒否する", () => {
		const incompleteData = {
			url: "https://example.com/image.png",
		};

		expect(() => enclosureSchema.parse(incompleteData)).toThrow();
	});
});

describe("zennItemスキーマ", () => {
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

	it("有効なZennアイテムをパースできる", () => {
		const result = zennItemSchema.parse(validZennItem);
		expect(result).toEqual({
			...validZennItem,
			enclosure: {
				...validZennItem.enclosure,
				length: 12345,
			},
		});
	});

	it("titleが欠けている場合は拒否する", () => {
		const { title, ...itemWithoutTitle } = validZennItem;
		expect(() => zennItemSchema.parse(itemWithoutTitle)).toThrow();
	});

	it("無効なlink URLの場合は拒否する", () => {
		const itemWithInvalidLink = {
			...validZennItem,
			link: "not-a-url",
		};
		expect(() => zennItemSchema.parse(itemWithInvalidLink)).toThrow();
	});

	it("無効なisoDateの場合は拒否する", () => {
		const itemWithInvalidDate = {
			...validZennItem,
			isoDate: "not-a-date",
		};
		expect(() => zennItemSchema.parse(itemWithInvalidDate)).toThrow();
	});

	it("enclosureが欠けている場合は拒否する", () => {
		const { enclosure, ...itemWithoutEnclosure } = validZennItem;
		expect(() => zennItemSchema.parse(itemWithoutEnclosure)).toThrow();
	});
});
