# start.sh
# ----------------------------------------------------
#!/bin/bash

# Membaca file .env dan mengekspor variabelnya
export $(grep -v '^#' .env | xargs)

# Menjalankan aplikasi Node.js dengan variabel yang sudah diekspor
node server.js
