import { Plus, Trash2 } from "lucide-react";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { VariantFormData } from "./VariantForm";

interface AttributeFieldsProps {
	register: UseFormRegister<VariantFormData>;
	errors: FieldErrors<VariantFormData>;
	setValue: UseFormSetValue<VariantFormData>;
	watch: UseFormWatch<VariantFormData>;
}

export function AttributeFields({ register, errors, setValue, watch }: AttributeFieldsProps) {
	const attributes = watch("attributes") || [];

	const addAttribute = () => {
		setValue("attributes", [...attributes, { attribute_name: "", attribute_value: "" }]);
	};

	const removeAttribute = (index: number) => {
		setValue(
			"attributes",
			attributes.filter((_, i) => i !== index)
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<label className="text-sm font-semibold text-gray-700">Variant Attributes</label>
				<button
					type="button"
					onClick={addAttribute}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all"
				>
					<Plus className="w-3.5 h-3.5" />
					Add Attribute
				</button>
			</div>

			{attributes.length === 0 ? (
				<p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
					No attributes added. Click "Add Attribute" to specify options like Color or Size.
				</p>
			) : (
				<div className="space-y-3">
					{attributes.map((_, index) => (
						<div key={index} className="flex gap-3 items-start">
							<div className="flex-1 space-y-1">
								<input
									{...register(`attributes.${index}.attribute_name`)}
									className="block w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
									placeholder="e.g. Color"
								/>
								{errors.attributes?.[index]?.attribute_name && (
									<p className="text-[10px] text-red-500 font-medium">
										{errors.attributes[index]?.attribute_name?.message}
									</p>
								)}
							</div>
							<div className="flex-1 space-y-1">
								<input
									{...register(`attributes.${index}.attribute_value`)}
									className="block w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
									placeholder="e.g. Blue"
								/>
								{errors.attributes?.[index]?.attribute_value && (
									<p className="text-[10px] text-red-500 font-medium">
										{errors.attributes[index]?.attribute_value?.message}
									</p>
								)}
							</div>
							<button
								type="button"
								onClick={() => removeAttribute(index)}
								className="mt-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
