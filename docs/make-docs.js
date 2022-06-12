// jsdoc2md --json docs/math.docs.js > docs/docs.json

const jsdoc2md = require("jsdoc-to-markdown");

// {
//   "id": "magnitude2",
//   "longname": "magnitude2",
//   "name": "magnitude2",
//   "kind": "function",
//   "scope": "global",
//   "description": "compute the magnitude a 2D vector",
//   "params": [
//     {
//       "type": {
//         "names": [
//           "Array.<number>"
//         ]
//       },
//       "description": "one 2D vector",
//       "name": "v"
//     }
//   ],
//   "returns": [
//     {
//       "type": {
//         "names": [
//           "number"
//         ]
//       },
//       "description": "one scalar"
//     }
//   ],
//   "meta": {
//     "lineno": 417,
//     "filename": "math.docs.js",
//     "path": "/Users/robby/Code/RabbitEarJS/Math/docs"
//   },
//   "order": 23
// };

const makeTSDefinition = (el) => {
	return `\`\`\`typescript
(v: number[], u: number[]): number[]
\`\`\``;
};

const formatType = (str) => {
	if (str.substr(0, 6) === "Array.") {
		const rest = str.substr(6);
		rest.replace(/[^\w\s]/gi, '')
		const inside = rest.replace(/[<>]/gi, "");
		return `${inside}[]`;
	}
	return str;
};

const makeTypeListString = el => el.type && el.type.names && el.type.names.length
		? `\`${el.type.names.map(formatType).join("|")}\``
		: undefined;

const makeTypeDescriptionEntryString = (el) => [makeTypeListString(el), el.description]
	.filter(a => a !== undefined)
	.join(" ");

const makeTypeDescriptionUnorderedList = (arr) => arr
	.map(makeTypeDescriptionEntryString)
	.map(str => `- ${str}`)
	.join("\n");

const makeTypeDescriptionOrderedList = (arr) => arr
	.map(makeTypeDescriptionEntryString)
	.map((str, i) => `${i+1}. ${str}`)
	.join("\n");

const makeParamsSection = (data) => data.params && data.params.length
	? `params\n\n${makeTypeDescriptionOrderedList(data.params)}`
	: undefined;

const makeReturnSection = (data) => data.returns && data.returns.length
	? `returns\n\n${makeTypeDescriptionUnorderedList(data.returns)}`
	: undefined;

const formatData = (data) => {
	if (!data.description || !data.params || !data.returns) { return; }
	const title = `### ${data.name}`;
	const tsDef = makeTSDefinition(data);
	const body = [data.description, makeParamsSection(data), makeReturnSection(data)]
		.filter(a => a !== undefined)
		.join("\n\n");
	return [title, tsDef, body].join("\n\n");
};

const processJSON = (json) => {
	if (json.constructor !== Array) { return; }
	const good = json.filter(el => el.description);
	const markdown = good
		.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
		.map(data => formatData(data))
		.filter(a => a !== undefined)
		.join("\n\n");
	console.log(markdown);
};

jsdoc2md.getJsdocData({ files: './docs/math.docs.js' })
	.then(processJSON);
