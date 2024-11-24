import "./style.css";

// Configuração inicial da aplicação
document.querySelector("#app").innerHTML = `
  <div>
    <!-- Cabeçalho -->
    <header class="header">
      <h1>📡 BIOTRACK</h1>
    </header>

    <!-- Conteúdo principal -->
    <main class="container">
      
      <!-- Seção de Destaques -->
      <section class="highlight-section">
        <h2 style="margin-bottom: 20px;">Qualidade do AR</h2>
        
        <!-- Indicadores de Status -->
        <div class="status-container">
          <div class="status-item">
            <div class="status-bullet good"></div>
            <span class="status-text">Boa</span>
          </div>
          <div class="status-item">
            <div class="status-bullet moderate"></div>
            <span class="status-text">Moderada</span>
          </div>
          <div class="status-item">
            <div class="status-bullet bad"></div>
            <span class="status-text">Ruim</span>
          </div>
        </div>

        <!-- Dados dos Sensores -->
        <div class="sensor-data-container">
          <!-- Média -->
          <div class="sensor-box">
            <p class="notranslate" translate="no">Média</p>
            <p id="gas-media" class="gas-media notranslate" translate="no">0</p>
            <p class="sensor-ppm">PPM</p>
          </div>

          <!-- Loader com Indicador Circular -->
          <div class="loader">
            <div class="box">
              <div class="box-circle">
                <svg>
                  <circle cx="130" cy="130" r="120"></circle>
                  <circle cx="130" cy="130" r="120" id="circle-two"></circle>
                </svg>
                <div class="sensor-value">
                  <h2 id="gas-level" class="gas-level">0</h2>
                  <p class="sensor-ppm">PPM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pico -->
          <div class="sensor-box">
            <p class="notranslate" translate="no">Pico</p>
            <p id="gas-pico" class="gas-pico notranslate" translate="no">0</p>
            <p class="sensor-ppm">PPM</p>
          </div>
        </div>
      </section>

      <!-- Seção de Alertas -->
      <section class="alert-section">
        <h2>Status do Ambiente</h2>
        <div id="status-box" class="status-box safe">
          <p id="text-box">🌞 Qualidade do ar está ótima</p>
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
              <th>Partes por milhão (ppm)</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
      
    </main>
  </div>
`;
