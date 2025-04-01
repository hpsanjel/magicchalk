"use client";

import React, { useState } from "react";
import useFetchData from "@/hooks/useFetchData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export default function UsersPage() {
	const [openUserModal, setOpenUserModal] = useState(false);
	const { data: users, error, loading, mutate } = useFetchData("/api/users", "users");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				const response = await fetch(`/api/users/${id}`, {
					method: "DELETE",
				});
				if (!response.ok) {
					throw new Error("Failed to delete user");
				}
				mutate();
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("Failed to delete user. Please try again.");
			}
		}
	};

	const handleCloseUserModal = () => {
		setOpenUserModal(false);
		mutate();
	};

	const handleCreateUser = () => {
		setOpenUserModal(true);
	};

	return (
		<div className="max-w-4xl">
			<div className="text-left">
				<button onClick={handleCreateUser} className="bg-red-800 text-slate-200 font-bold px-4 py-2 my-4">
					Register User
				</button>
			</div>
			<div className=" bg-white rounded-lg shadow">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Full Name</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length > 0 ? (
							users.map((user) => (
								<TableRow key={user._id}>
									<TableCell className="w-96 font-semibold">{user.fullName}</TableCell>
									<TableCell className="w-96">{user.userName}</TableCell>
									<TableCell className="w-96">{user.email} </TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)}>
												<Trash2 className="w-6 h-6 text-red-700" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No user has been created yet. Please create one if needed.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{openUserModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-lg font-bold text-slate-200 bg-red-700 p-4 mb-6 text-center">Register User</h2>
						<RegisterForm handleCloseUserModal={handleCloseUserModal} fetchUsers={users} />
					</div>
				</div>
			)}
		</div>
	);
}
