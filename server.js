const express = require("express");
const cors = require("cors");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Google Sheets Setup
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/gifts", async (req, res) => {
  try {
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      throw new Error("Falta la variable GOOGLE_SHEETS_SPREADSHEET_ID en .env");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: "A2:G", // Rango más amplio para evitar errores de desplazamiento
    });

    const rows = response.data.values || [];
    console.log(`Filas recibidas: ${rows.length}. Ejemplo de fila 1:`, rows[0]);

    const gifts = rows.map((row, index) => {
      // Buscamos algo que parezca una URL en las columnas del final (evitando la F si es posible)
      const possibleImage = row[4] || row[6] || row[3] || "";
      
      if (possibleImage && possibleImage.startsWith('http')) {
        console.log(`[DEBUG] Imagen encontrada en Fila ${index + 2}: "${possibleImage.substring(0, 30)}..."`);
      }

      return {
        name: row[0] || "Sin nombre",
        link: row[1] || "",
        description: row[1] || "",
        reserved: (row[2] || "").toLowerCase() === "yes" || (row[2] || "").toLowerCase() === "si",
        image: possibleImage.trim(),
        showReserveButton: (row[5] || "").toLowerCase() !== "no", // Columna F
      };
    });
    
    console.log("Total imágenes detectadas:", gifts.filter(g => g.image).length);
    res.json(gifts);
  } catch (error) {
    if (error.message.includes("CREDENTIALS")) {
      console.error("Error de Autenticación:", error.message);
      console.error("Asegúrate de que GOOGLE_APPLICATION_CREDENTIALS apunte al archivo correcto.");
    } else {
      console.error("Error fetching sheets:", error.message);
    }
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});

app.post("/api/reserve", async (req, res) => {
  try {
    const { giftName, nombre, whatsapp, mensaje } = req.body;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // 1. Obtener todas las filas para encontrar el índice
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A:A", // Buscamos solo en la columna A
    });

    const rows = getResponse.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] && row[0].trim() === giftName.trim());

    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: "Regalo no encontrado" });
    }

    // 2. Actualizar las celdas según el mapeo solicitado:
    // C (3): Si
    // D (4): Nombre
    // G (7): WhatsApp
    // H (8): Mensaje
    const actualRowIndex = rowIndex + 1;
    console.log(`[DEBUG] Reservando regalo: "${giftName}" en fila ${actualRowIndex}`);
    
    // Actualizamos C y D juntos (Columna 3 y 4)
    console.log(`[DEBUG] Actualizando Columna C y D con: ["Si", "${nombre}"]`);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `C${actualRowIndex}:D${actualRowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Si", nombre]],
      },
    });

    // Actualizamos G y H juntos (Columna 7 y 8)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `G${actualRowIndex}:H${actualRowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[whatsapp, mensaje]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error reservando:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "¡Hola desde el Backend del Baby Shower!" });
});

// Serve frontend build static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
