import NotFoungPage from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update user",
};

const UpdateUserPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) NotFoungPage();

  console.log("user", user);
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
    </div>
  );
};

export default UpdateUserPage;
