import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
    <header class="header " >
      <h1>📡 BIOTRACK</h1>
    </header>
    <div class="debug">DEBUG</div>

    <main class="container">
      <section class="highlight-section">
        <h2 style="margin-bottom: 20px;">Qualidade do AR</h2>
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

        <div class="sensor-data-container">
          <div class="sensor-box">
            <p class="notranslate" translate="no">Média</p>
            <p id="gas-media" class="gas-media notranslate" translate="no">0</p>
            <p class="sensor-ppm">PPM</p>
          </div>
        <div class="loader">
            <div class="box">
                <div class="box-circle">
                    <svg>
                        <circle cx="70" cy="70" r="70" fill="red" stroke="black"></circle>
                        <circle cx="70" cy="70" r="70" fill="red" stroke="black" id="circle-two"></circle>
                    </svg>
                    <div class="sensor-value">
                        <h2 id="gas-level" class="gas-level">0</h2>
                    </div>
                </div>
            </div>
        </div>


          <div class="sensor-box">
            <p class="notranslate" translate="no">Pico</p>
            <p id="gas-pico" class="gas-pico notranslate" translate="no">0</p>
            <p class="sensor-ppm">PPM</p>
          </div>
        </div>
      </section>

      <section class="alert-section">
        <h2>Status do Ambiente</h2>
        <div id="status-box" class="status-box safe">
          <p>Nível seguro de gás detectado.</p>
        </div>
      </section>

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
          <tbody></tbody>
        </table>
      </section>
    </main>
  </div>
`;
