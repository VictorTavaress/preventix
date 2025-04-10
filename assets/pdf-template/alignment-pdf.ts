export const alignmentTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <title>Relatório de Alinhamento</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <style>
    html, body {
      background:rgb(255, 255, 255) !important;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>

<body style="margin: 0;">
 <div style="background:rgb(255, 255, 255); min-height: 90vh; padding: 40px; font-family: Arial, sans-serif;">
    <!-- todo o conteúdo do relatório aqui -->
 
  <!-- Cabeçalho -->
  <div style="background: rgb(15, 155, 211); padding: 20px 32px; border-radius: 2px; margin-bottom: 20px; color: #fff; text-align: center;">
    <div style="font-size:16px; font-weight: bold;">Relatório de Alinhamento de Eixo</div>
    <div style="font-size: 12px; margin-top: 2px;">Alinhamento a Laser</div>
  </div>

  <!-- Informações gerais -->
  <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: space-between">
    <div style="width: 600px">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-bottom: 10px;">
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">ID da Máquina</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{machineId}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Data</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{date}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Empresa</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{company}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Operador</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{operator}}</div>
        </div>
      </div>
      <div>
        <label style="font-size: 12px; font-weight: bold; margin-bottom: 4px; color: #222; display: block;">Notas</label>
        <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px; height: 50px">{{notes}}</div>
      </div>
    </div>
    <div>
     {{firstImage}}
    </div>
  </div>

  <!-- Tolerâncias -->
  <div style="margin-bottom: 10px;">
    <div style="font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #222;">Tolerâncias</div>
    <table style="width: 100%; border-collapse: collapse; border-radius: 2px; overflow: hidden; font-size: 12px; text-align: center;">
      <thead>
        <tr>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Velocidade (rpm)</th>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Desvio (mm)</th>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Erro Angular (mm/100)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{speed}}</td>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{deviation}}</td>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{angularError}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Resultados -->
  <div style="background: rgb(15, 155, 211); padding: 10px 32px; border-radius: 2px; margin-bottom: 10px; color: #fff; text-align: center;">
    <div style="font-size: 16px; font-weight: bold;">Resultados</div>
  </div>

  <div style="display: flex; gap: 20px;">
    <!-- Conforme Encontrado -->
    <div style="flex: 1 1 48%;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
        <thead>
          <tr>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Conforme Encontrado <span style="color: red;">✗</span></th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Vertical</th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Horizontal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Desvio (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{foundDeviationVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{foundDeviationHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Ângulo (mm/100)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{foundAngleVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{foundAngleHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Pé Dianteiro (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{foundFrontFootVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{foundFrontFootHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Pé Traseiro (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{foundRearFootVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{foundRearFootHorizontal}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Conforme Corrigido -->
    <div style="flex: 1 1 48%;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
        <thead>
          <tr>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Conforme Corrigido <span style="color: green;">✓</span></th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Vertical</th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Horizontal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Desvio (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{correctedDeviationVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{correctedDeviationHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Ângulo (mm/100)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{correctedAngleVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{correctedAngleHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Pé Dianteiro (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctedFrontFootVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctedFrontFootHorizontal}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Pé Traseiro (mm)</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctedRearFootVertical}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctedRearFootHorizontal}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
 <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px;">
    <div style="width: 100%; border: 1px solid #ccc; padding: 8px; font-family: Arial, sans-serif; font-size: 12px; background: #fff;">
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
        <span style="color: #000;">V-Desvio:</span>
        <span style="float: right;">{{foundDeviationVertical}}</span>
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px;">
        <span style="color: #000;">V-Ângulo:</span>
        <span style="float: right;">{{foundAngleVertical}}</span>
      </div>
      <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
        <!-- Substituir pelo desenho técnico abaixo -->
        <img src="https://www.researchgate.net/publication/311809922/figure/fig3/AS:442068519657474@1482408756341/Figura-5-Desalinhamento-e-Alinhamento-de-eixos.png" alt="Alinhamento Motor" style="width: 150px;">
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
        <span style="color: #000;">H-Desvio:</span>
        <span style="float: right;">{{foundDeviationHorizontal}}</span>
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px;">
        <span style="color: #000;">H-Ângulo:</span>
        <span style="float: right;">{{foundAngleHorizontal}}</span>
      </div>
  </div>
 <div style="width: 100%; border: 1px solid #ccc; padding: 8px; font-family: Arial, sans-serif; font-size: 12px; background: #fff;">
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
        <span style="color: #000;">V-Desvio:</span>
        <span style="float: right;">{{correctedDeviationVertical}}</span>
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px;">
        <span style="color: #000;">V-Ângulo:</span>
        <span style="float: right;">{{correctedAngleVertical}}</span>
      </div>
      <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
        <!-- Substituir pelo desenho técnico abaixo -->
        <img src="https://www.researchgate.net/publication/311809922/figure/fig3/AS:442068519657474@1482408756341/Figura-5-Desalinhamento-e-Alinhamento-de-eixos.png" alt="Alinhamento Motor" style="width: 150px;">
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
        <span style="color: #000;">H-Desvio:</span>
        <span style="float: right;">{{correctedDeviationHorizontal}}</span>
      </div>
      <div style="background: #ffffcc; padding: 4px 6px; border-radius: 4px;">
        <span style="color: #000;">H-Ângulo:</span>
        <span style="float: right;">{{correctedAngleHorizontal}}</span>
      </div>
  </div>
 </div>

  <!-- Fotos da máquina -->
    {{photos}}
   </div>
</body>
</html>
`;