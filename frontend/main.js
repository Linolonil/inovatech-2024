import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
    <header class="header safe" id="header">
      <h1>📡 Monitoramento de Gás - Sensor MQ-135</h1>
    </header>

    <main class="container">
      <!-- Seção de Destaque do Sensor -->
      <section class="highlight-section">
        <h2>Dados  do Sensor</h2>
        <div class="sensor-data-container">
        <!-- Média do Dia -->
        <div class="sensor-box">
        <p class="notranslate" translate="no">Média</p>
          <p id="gas-media" class="gas-media notranslate" translate="no">Carregando...</p>
          <p class="sensor-ppm">PPM</p>
        </div>
          <!-- Dado Atual -->
          <div class="sensor-box">
        <p class="notranslate" translate="no">Dado atual</p>
            <p id="gas-level" class="sensor-value notranslate" translate="no">Carregando...</p>
            <p id="gas-ppm" class="sensor-ppm">PPM</p>
          </div>
          
          
          <!-- Pico -->
          <div class="sensor-box">
        <p class="notranslate" translate="no">Pico</p>
            <p id="gas-pico" class="gas-pico notranslate" translate="no">Carregando...</p>
            <p class="sensor-ppm">PPM</p>
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
            </tr>
          </thead>
          <tbody>
            <!-- Linhas de histórico serão adicionadas dinamicamente -->
          </tbody>
        </table>
      </section>
    </main>
  </div>
`;
