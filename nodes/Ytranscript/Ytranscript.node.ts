import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YTranscript',
		name: 'ytranscript',
		group: ['transform'],
		version: 1,
		description: 'Get transcript from YouTube videos',
		defaults: {
			name: 'YTranscript',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Video URL',
				name: 'videoUrl',
				type: 'string',
				default: '',
				placeholder: 'https://www.youtube.com/watch?v=VIDEO_ID',
				description: 'The URL of the YouTube video to get the transcript from',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.myString = myString;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
