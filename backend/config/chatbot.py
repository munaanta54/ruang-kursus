import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
REFERENCE_FILE = PROJECT_ROOT / "ai-reference" / "informasi-kursus.txt"


def load_reference():
    try:
        return REFERENCE_FILE.read_text(encoding="utf-8")
    except Exception as error:
        print("REFERENCE PATH:", REFERENCE_FILE)
        print("REFERENCE ERROR:", error)
        return ""


def split_sections(text):
    sections = {}
    current_title = None
    current_content = []

    for line in text.splitlines():
        stripped = line.strip()

        if stripped.startswith("#"):
            if current_title:
                sections[current_title] = "\n".join(
                    current_content
                ).strip()

            current_title = stripped.lstrip("#").strip().upper()
            current_content = []

        elif current_title:
            current_content.append(line)

    if current_title:
        sections[current_title] = "\n".join(
            current_content
        ).strip()

    return sections


def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_section(sections, title):
    content = sections.get(title, "")

    if content:
        return content

    return "Maaf, informasi tersebut belum tersedia di RuangKursus."


def chatbot_response(message):
    reference = load_reference()

    if not reference:
        return "Maaf, data referensi RuangKursus belum tersedia."

    sections = split_sections(reference)
    question = normalize(message)

    if any(word in question for word in [
        "halo", "hai", "hello", "hi"
    ]):
        return (
            "Halo! 👋 Saya RuangKursus AI.\n\n"
            "Saya dapat membantu mengenai kursus, "
            "pendaftaran, pembayaran, jam operasional, "
            "dan Customer Service."
        )

    if any(word in question for word in [
        "pembayaran", "bayar", "transfer",
        "rekening", "bca", "bri"
    ]):
        return get_section(
            sections,
            "TATA CARA PEMBAYARAN"
        )

    if any(word in question for word in [
        "pendaftaran", "daftar", "mendaftar",
        "registrasi", "cara daftar"
    ]):
        return get_section(
            sections,
            "ALUR PENDAFTARAN"
        )

    if any(word in question for word in [
        "jam operasional", "jam buka",
        "jam tutup", "operasional"
    ]):
        return get_section(
            sections,
            "TENTANG RUANGKURSUS"
        )

    if any(word in question for word in [
        "kontak", "customer service",
        "whatsapp", "admin", "email"
    ]):
        return get_section(
            sections,
            "KONTAK CUSTOMER SERVICE"
        )

    if any(word in question for word in [
        "apa itu ruangkursus",
        "tentang ruangkursus",
        "tentang kursus",
        "ruangkursus itu apa",
        "website ini"
    ]):
        return get_section(
            sections,
            "TENTANG RUANGKURSUS"
        )

    if any(word in question for word in [
        "kursus", "kelas", "program",
        "workshop", "network programming",
        "kelas goceng"
    ]):
        return get_section(
            sections,
            "INFORMASI KURSUS"
        )

    return (
        "Maaf, saya belum menemukan informasi yang sesuai.\n\n"
        "Silakan tanyakan tentang kursus, pendaftaran, "
        "pembayaran, jam operasional, atau Customer Service."
    )