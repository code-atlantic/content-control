export type TabComponent = {
	name: string;
	title: string;
	className: string;
	pageTitle: string;
	heading: string;
	comp?: () => JSX.Element;
};