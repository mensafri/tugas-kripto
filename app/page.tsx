// app/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Hard‑coded group & members
const GROUP_NAME = "Kelompok 7";
const MEMBERS = [
	{ name: "Muhammad Amin Syaifani", nim: "C2C022029" },
	{ name: "Adi Nugroho", nim: "C2C022027" },
	{ name: "JANU YOGI KURNIA", nim: "C2C022022" },
	{ name: "Bima Wahyu Pradana", nim: "C2C022037" },
	{ name: "Syafrie Abdunnasir Jawad", nim: "C2C022011" },
];

export default function HomePage() {
	// Cipher state
	const [key, setKey] = useState("");
	const [plain, setPlain] = useState("");
	const [cipher, setCipher] = useState("");
	const [decrypted, setDecrypted] = useState("");

	// Keep only A–Z, uppercase
	const sanitize = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, "");

	const vigenere = (text: string, key: string, decrypt = false) => {
		const t = sanitize(text);
		const k = sanitize(key);
		if (!k) return "";
		let out = "";
		let ki = 0;
		for (let i = 0; i < t.length; i++) {
			const tC = t.charCodeAt(i) - 65;
			const kC = k.charCodeAt(ki % k.length) - 65;
			const shift = decrypt ? (tC - kC + 26) % 26 : (tC + kC) % 26;
			out += String.fromCharCode(shift + 65);
			ki++;
		}
		return out;
	};

	// Button handlers
	const handleClear = () => {
		setPlain("");
		setCipher("");
		setDecrypted("");
	};
	const handleEncrypt = () => {
		setCipher(vigenere(plain, key, false));
		setDecrypted("");
	};
	const handleDecrypt = () => {
		setDecrypted(vigenere(cipher, key, true));
	};
	const handleClose = () => {
		if (typeof window !== "undefined") window.close();
	};

	return (
		<div className="max-w-2xl mx-auto py-8 space-y-8">
			{/* HEADER */}
			<div className="text-center space-y-1">
				<h1 className="text-3xl font-bold">TUGAS 2 KRIPTOGRAFI</h1>
				<h2 className="text-2xl font-semibold">APLIKASI VIGENERE CHIPER</h2>
			</div>

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
				<div className="space-y-2">
					<label className="block font-semibold">Key</label>
					<input
						type="text"
						className="w-full px-3 py-2 border rounded"
						placeholder="Masukkan key"
						value={key}
						onChange={(e) => setKey(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<label className="block font-semibold">Plaintext</label>
					<Textarea
						placeholder="Ketik plaintext"
						value={plain}
						onChange={(e) => setPlain(e.target.value)}
						rows={4}
					/>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={handleClear}
						variant="outline">
						PB1: Kosongkan
					</Button>
					<Button onClick={handleEncrypt}>PB2: Enkripsi</Button>
				</div>

				<div className="space-y-2">
					<label className="block font-semibold">Ciphertext</label>
					<Textarea
						placeholder="Hasil ciphertext"
						value={cipher}
						readOnly
						rows={4}
					/>
				</div>

				<div className="flex gap-2">
					<Button onClick={handleDecrypt}>PB3: Dekripsi</Button>
				</div>

				<div className="space-y-2">
					<label className="block font-semibold">Decrypted Text</label>
					<Textarea
						placeholder="Hasil dekripsi"
						value={decrypted}
						readOnly
						rows={4}
					/>
				</div>

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
