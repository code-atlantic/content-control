interface Restriction extends TableItemBase {
	title: string;
	who: 'logged_in' | 'logged_out';
	roles: string[];
	[ key: string ]: any;
}
