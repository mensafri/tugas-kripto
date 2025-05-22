// app/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   Static data
   ========================================================= */
const GROUP_NAME = "Kelompok 7";
const MEMBERS = [
	{ name: "Muhammad Amin Syaifani", nim: "C2C022029" },
	{ name: "Adi Nugroho", nim: "C2C022027" },
	{ name: "JANU YOGI KURNIA", nim: "C2C022022" },
	{ name: "Bima Wahyu Pradana", nim: "C2C022037" },
	{ name: "Syafrie Abdunnasir Jawad", nim: "C2C022011" },
];

/* =========================================================
   Helpers
   ========================================================= */
// Convert File → data URL (base64)
const fileToDataUrl = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});

// Column order for transposition cipher (A-Z)
const getColumnOrder = (k: string) =>
	k
		.toUpperCase()
		.replace(/[^A-Z]/g, "")
		.split("")
		.map((ch, idx) => ({ ch, idx }))
		.sort((a, b) => a.ch.localeCompare(b.ch))
		.map((o) => o.idx);

/* =========================================================
   Cipher core (works on arbitrary strings, incl. base64)
   ========================================================= */
const encrypt = (text: string, k: string) => {
	if (!k) return "";
	const cols = k.length;
	const rows = Math.ceil(text.length / cols);
	const padChar = "="; // safe for base64
	const padded = text.padEnd(rows * cols, padChar);

	const order = getColumnOrder(k);
	let out = "";
	for (const col of order) {
		for (let r = 0; r < rows; r++) {
			out += padded[r * cols + col];
		}
	}
	return out;
};

const decrypt = (ct: string, k: string) => {
	if (!k) return "";
	const cols = k.length;
	if (ct.length % cols !== 0) return ""; // invalid data
	const rows = ct.length / cols;

	const order = getColumnOrder(k);
	const colData: string[] = Array(cols).fill("");
	let cursor = 0;
	for (const col of order) {
		colData[col] = ct.slice(cursor, cursor + rows);
		cursor += rows;
	}

	let out = "";
	for (let r = 0; r < rows; r++) {
		for (let cIdx = 0; cIdx < cols; cIdx++) {
			out += colData[cIdx][r];
		}
	}
	return out;
};

/* =========================================================
   Component
   ========================================================= */
export default function HomePage() {
	// States
	const [key, setKey] = useState("");
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null); // plaintext (data-URL)
	const [cipher, setCipher] = useState("");
	const [decrypted, setDecrypted] = useState("");

	/* ---------------- File handler ---------------- */
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const dataUrl = await fileToDataUrl(file);
		setImageDataUrl(dataUrl);
		setCipher("");
		setDecrypted("");
	};

	/* ---------------- Buttons ---------------- */
	const handleClear = () => {
		setImageDataUrl(null);
		setCipher("");
		setDecrypted("");
	};

	const handleEncrypt = () => {
		if (!imageDataUrl) return;
		setCipher(encrypt(imageDataUrl, key));
		setDecrypted("");
	};

	const handleDecrypt = () => {
		if (!cipher) return;
		setDecrypted(decrypt(cipher, key));
	};

	const handleClose = () => {
		if (typeof window !== "undefined") window.close();
	};

	/* ---------------- UI ---------------- */
	return (
		<div className="max-w-2xl mx-auto py-8 space-y-8">
			{/* HEADER */}
			<div className="text-center space-y-1">
				<h1 className="text-3xl font-bold">TUGAS 2 KRIPTOGRAFI</h1>
				<h2 className="text-2xl font-semibold">APLIKASI TRANSPOSISI CIPHER</h2>
			</div>

			{/* GROUP INFO */}
			<div className="flex items-center justify-center gap-2">
				<span className="font-medium">KELOMPOK:</span>
				<span>{GROUP_NAME}</span>
			</div>
			<div className="space-y-1">
				{MEMBERS.map((m, i) => (
					<div
						key={i}
						className="flex items-center justify-center gap-4">
						<span className="w-6 text-right">{i + 1}.</span>
						<span className="flex-1">{m.name}</span>
						<span>NIM: {m.nim}</span>
					</div>
				))}
			</div>

			{/* CIPHER UI */}
			<div className="space-y-4">
				{/* KEY */}
				<div className="space-y-2">
					<label className="block font-semibold">Key</label>
					<input
						type="text"
						className="w-full px-3 py-2 border rounded"
						placeholder="Masukkan key (A-Z)"
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
				</div>

				{/* FILE UPLOAD */}
				<div className="space-y-2">
					<label className="block font-semibold">Gambar (Plain Image)</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
					/>
					{imageDataUrl && (
						<div className="pt-2">
							<img
								src={imageDataUrl}
								alt="Uploaded preview"
								className="max-h-64 mx-auto rounded border"
							/>
						</div>
					)}
				</div>

				{/* ACTION BUTTONS */}
				<div className="flex gap-2">
					<Button
						onClick={handleClear}
						variant="outline">
						PB1: Kosongkan
					</Button>
					<Button onClick={handleEncrypt}>PB2: Enkripsi</Button>
				</div>

				{/* CIPHERTEXT */}
				<div className="space-y-2">
					<label className="block font-semibold">Ciphertext</label>
					<Textarea
						placeholder="Hasil ciphertext"
						value={cipher}
						readOnly
						rows={6}
					/>
				</div>

				{/* DECRYPT BUTTON */}
				<div className="flex gap-2">
					<Button onClick={handleDecrypt}>PB3: Dekripsi</Button>
				</div>

				{/* DECRYPTED PREVIEW */}
				{decrypted && (
					<div className="space-y-2">
						<label className="block font-semibold">Decrypted Image</label>
						<img
							src={decrypted}
							alt="Decrypted preview"
							className="max-h-64 mx-auto rounded border"
						/>
					</div>
				)}

				{/* CLOSE */}
				<div className="text-center">
					<Button
						onClick={handleClose}
						variant="destructive">
						PB4: Tutup Aplikasi
					</Button>
				</div>
			</div>
		</div>
	);
}
