interface Props {
	label: string;
	type: string;
	required?: boolean;
	field: {
		value: string;
		onChange: (e: React.ChangeEvent<any>) => void;
		onBlur: (e: React.FocusEvent<any>) => void;
	};
}

export const Input = ({ label, type, field, required = false }: Props) => {
	return (
		<div className="input-component flex flex-col gap-2 justify-start items-center w-80 max-w-full">
			<label className="text-base text-left w-11/12 font-semibold">{label}</label>
			<input
				className="border border-neutral-300 rounded-md w-11/12 px-3 py-2 outline-none focus:ring-2 ring-offset-2 ring-zinc-300"
				type={type}
				{...field}
				required={required}
			/>
		</div>
	);
};	