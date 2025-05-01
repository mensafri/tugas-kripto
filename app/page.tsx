// app/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Hard-coded group & members
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

	/* =========================================================
     COLUMNAR TRANSPOSITION
     ---------------------------------------------------------
     - Enkripsi:  tulis teks per-baris (row wise) dengan kolom
                  = panjang key, lalu baca per-kolom menurut
                  urutan alfabet huruf kunci.
     - Dekripsi:  bangun kembali matriks kolom berdasarkan urutan
                  tadi, lalu baca per-baris.
     ========================================================= */

	const getColumnOrder = (k: string) =>
		k
			.split("")
			.map((ch, idx) => ({ ch, idx }))
			.sort((a, b) => a.ch.localeCompare(b.ch)) // A-Z
			.map((o) => o.idx);

	const encrypt = (text: string, k: string) => {
		const t = sanitize(text);
		const keySan = sanitize(k);
		if (!keySan) return "";
		const cols = keySan.length;
		const rows = Math.ceil(t.length / cols);
		const padChar = "X";
		const padded = t.padEnd(rows * cols, padChar);

		const order = getColumnOrder(keySan);
		let out = "";
		for (const col of order) {
			for (let r = 0; r < rows; r++) {
				out += padded[r * cols + col];
			}
		}
		return out;
	};

	const decrypt = (ct: string, k: string) => {
		const c = sanitize(ct);
		const keySan = sanitize(k);
		if (!keySan) return "";
		const cols = keySan.length;
		if (c.length % cols !== 0) return ""; // data tak valid
		const rows = c.length / cols;

		const order = getColumnOrder(keySan);
		// Alokasikan tiap kolom sepanjang 'rows'
		const colData: string[] = Array(cols).fill("");
		let cursor = 0;
		for (const col of order) {
			colData[col] = c.slice(cursor, cursor + rows);
			cursor += rows;
		}

		// Rekonstruksi teks baris-demi-baris
		let out = "";
		for (let r = 0; r < rows; r++) {
			for (let cIdx = 0; cIdx < cols; cIdx++) {
				out += colData[cIdx][r];
			}
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
		setCipher(encrypt(plain, key));
		setDecrypted("");
	};
	const handleDecrypt = () => {
		setDecrypted(decrypt(cipher, key));
	};
	const handleClose = () => {
		if (typeof window !== "undefined") window.close();
	};

	return (
		<div className="max-w-2xl mx-auto py-8 space-y-8">
			{/* HEADER */}
			<div className="text-center space-y-1">
				<h1 className="text-3xl font-bold">TUGAS 2 KRIPTOGRAFI</h1>
				<h2 className="text-2xl font-semibold">APLIKASI TRANSPOSISI CHIPER</h2>
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
