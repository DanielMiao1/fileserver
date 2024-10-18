interface ButtonData {
	callback: (this: HTMLButtonElement, event: MouseEvent) => void;
	classList?: string[];
	text: string;
}

export function createPopup(
	title: string,
	description: string,
	buttons?: ButtonData[]
) {
	const popup = document.createElement("div");
	popup.classList.add("popup");
	document.body.appendChild(popup);

	if (title) {
		const title_element = document.createElement("h1");
		title_element.innerText = title;
		popup.appendChild(title_element);
	}

	if (description) {
		const description_element = document.createElement("p");
		description_element.innerText = description;
		popup.appendChild(description_element);
	}

	if (buttons) {
		const buttons_group = document.createElement("div");

		for (const button of buttons) {
			const button_element = document.createElement("button");
			button_element.innerText = button.text;
			button_element.addEventListener("click", button.callback);

			if (button.classList) {
				button_element.classList.add(...button.classList);
			}

			buttons_group.appendChild(button_element);
		}

		popup.appendChild(buttons_group);
	}

	return popup;
}

export function closePopup() {
	const popup = document.getElementsByClassName("popup")[0];

	if (popup) {
		popup.remove();
	}
}
