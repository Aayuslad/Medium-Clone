import { useEffect, useState } from "react";
import { AuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import { UsersStore } from "../../stores/usersStore";
import RegularButton from "./RegularButton";

export default function AuthorMuteUnmuteButton({
	authorId,
	buttonSize = "sm",
}: {
	authorId: string;
	buttonSize?: "sm" | "lg";
}) {
	const [isMuted, setIsMuted] = useState<boolean | undefined>(undefined);
	const authStore = AuthStore();
	const usersStore = UsersStore();

	useEffect(() => {
		if (authorId && authStore.user?.id === authorId) {
			setIsMuted(undefined);
			return;
		}

		if (authorId && authStore.user?.mutedAuthors) {
			setIsMuted(authStore.user.mutedAuthors.some((userId) => userId === authorId));
		}
	}, [authorId, authStore.user]);

	function onClickHandler() {
		if (!authStore.user) {
			toast.error("Signin to mute author");
			return;
		}

		usersStore.muteAuthor({ authorId });

		authStore.setUser({
			...authStore.user,
			mutedAuthors: isMuted
				? (authStore.user.mutedAuthors || []).filter((userId) => userId !== authorId)
				: [...(authStore.user.mutedAuthors || []), authorId],
		});

		!isMuted && toast.success("Author muted");
	}

	return (
		<div className="authorMuteUnmuteButton">
			{buttonSize === "sm" && (
				<div>
					{isMuted !== undefined &&
						(!isMuted ? (
							<button
								disabled={usersStore.buttonLoading}
								onClick={(e) => {
									e.stopPropagation();
									onClickHandler();
								}}
							>
								Mute author
							</button>
						) : (
							<button
								content="Unmute author"
								disabled={usersStore.buttonLoading}
								onClick={(e) => {
									e.stopPropagation();
									onClickHandler();
								}}
							>
								Unmute Author
							</button>
						))}
					{isMuted === undefined && (
						<button
							content="Mute author"
							disabled={usersStore.buttonLoading}
							onClick={(e) => {
								e.stopPropagation();
								if (authorId && authStore.user?.id === authorId)
									toast.error("You can't mute yourself");
								else toast.error("signin to Mute author");
							}}
						>
							Mute author
						</button>
					)}
				</div>
			)}

			{buttonSize === "lg" && (
				<div>
					{isMuted !== undefined &&
						(!isMuted ? (
							<RegularButton
								type="button"
								text="Mute author"
								color="white"
								bgColor="green"
								borderColor="green"
								disabled={usersStore.buttonLoading}
								onClick={onClickHandler}
							/>
						) : (
							<RegularButton
								type="button"
								text="Unmute author"
								color="green"
								bgColor="white"
								borderColor="green"
								disabled={usersStore.buttonLoading}
								onClick={onClickHandler}
							/>
						))}
					{isMuted === undefined && (
						<RegularButton
							type="button"
							text="Mute author"
							color="white"
							bgColor="green"
							borderColor="green"
							disabled={usersStore.buttonLoading}
							onClick={onClickHandler}
						/>
					)}
				</div>
			)}
		</div>
	);
}
