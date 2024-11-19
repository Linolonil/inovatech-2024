import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
   <header class="header">
        <h1>📡 Monitoramento de Gás</h1>
    </header>

    <main class="container">
        <!-- Seção de Leitura Atual -->
        <section class="sensor-section">
            <h2>Leitura Atual do Sensor</h2>
            <div class="sensor-data">
                <div class="sensor-item">
                    <h3>Nível de Gás</h3>
                    <p id="gas-level">Carregando...</p>
                </div>
                <div class="sensor-item">
                    <h3>Temperatura</h3>
                    <p id="temperature">Carregando...</p>
                </div>
                <div class="sensor-item">
                    <h3>Umidade</h3>
                    <p id="humidity">Carregando...</p>
                </div>
            </div>
        </section>

        <!-- Seção de Status do Ambiente -->
        <section class="alert-section">
            <h2>Status do Ambiente</h2>
            <div id="status-box" class="status-box safe">
                <p>Nível seguro de gás detectado.</p>
            </div>
        </section>

        <!-- Seção de Histórico -->
        <section class="history-section">
            <h2>Histórico de Leituras</h2>
            <table id="history-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Nível de Gás (ppm)</th>
                        <th>Temperatura (°C)</th>
                        <th>Umidade (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Linhas de histórico serão adicionadas dinamicamente -->
                </tbody>
            </table>
        </section>
    </main>

  </div>
`