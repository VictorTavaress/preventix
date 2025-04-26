export const balancingTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <title>Relatório de Balanceamento</title>
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
  <div style="background: rgb(1, 153, 157); padding: 25px 32px; border-radius: 2px; margin-bottom: 20px; color: #fff; position: relative;">
    <!-- Logo à direita -->
    <div style="position: absolute; top: 10px; right: 15px;">
      {{companyLogo}}
    </div>

    <!-- Texto centralizado -->
    <div style="text-align: center;">
      <div style="font-size:16px; font-weight: bold;">Relatório de Balanceamento Dinâmico</div>
    </div>
  </div>

  <!-- Informações gerais -->
  <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: space-between">
    <div style="width: 600px">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-bottom: 10px;">
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Tag</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{tag}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Data</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{date}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Cliente</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{client}}</div>
        </div>
        <div>
          <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Técnico</label>
          <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{technician}}</div>
        </div>
        </div>
        <div>
         <label style="font-weight: bold; font-size: 12px; margin-bottom: 4px; display: block;">Solicitante</label>
         <div style="background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 6px; font-size: 12px;">{{requester}}</div>
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

  <!-- Informações da máquina -->
  <div style="margin-bottom: 10px;">
    <div style="font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #222;">Dados da máquina</div>
    <table style="width: 100%; border-collapse: collapse; border-radius: 2px; overflow: hidden; font-size: 12px; text-align: center;">
      <thead>
        <tr>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Rotação (rpm)</th>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Potência (CV)</th>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Número de Pás</th>
          <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #fff; font-weight: bold;">Transmissão</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{rotation}}</td>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{power}}</td>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{blades}}</td>
          <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px; background: #e8f0ff;">{{transmissionType}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Resultados -->
  <div style="background: rgb(1, 153, 157); padding: 10px 32px; border-radius: 2px; margin-bottom: 10px; color: #fff; text-align: center;">
    <div style="font-size: 16px; font-weight: bold;">Resultados</div>
  </div>

  <div style="display: flex; gap: 20px;">
    <!-- Massa de correção -->
    <div style="flex: 1 1 48%;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
        <thead>
          <tr>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Massa teste e correção</th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Peso(G)</th>
            <th style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Ângulo(°)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Peso teste 1</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{weight1}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{angle1}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Massa de correção 1</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctionWeight1}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctionAngle1}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Peso teste 2</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{weight2}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{angle2}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">Massa de correção 2</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctionWeight2}}</td>
            <td style="padding: 5px 10px; border: 1px solid #333; font-size: 12px;">{{correctionAngle2}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Conforme Corrigido -->
    <div style="flex: 1 1 48%;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
            <thead>
            <tr>
                <th style="padding: 5px 10px; border: 1px solid #333;">Vibração</th>
                <th style="padding: 5px 10px; border: 1px solid #333;">Valor(mm.s)</th>
                <th style="padding: 5px 10px; border: 1px solid #333;">Resultado(%)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="padding: 5px 10px; border: 1px solid #333;">Vibração inicial 1</td>
                <td style="padding: 5px 10px; border: 1px solid #333;">{{initial1}}</td>
                <td style="padding: 5px 10px; border: 1px solid #333; background: #e8f0ff;" rowspan="2">{{result1}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 10px; border: 1px solid #333;">Vibração final 1</td>
                <td style="padding: 5px 10px; border: 1px solid #333;">{{final1}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 10px; border: 1px solid #333;">Vibração inicial 2</td>
                <td style="padding: 5px 10px; border: 1px solid #333;">{{initial2}}</td>
                <td style="padding: 5px 10px; border: 1px solid #333;background: #e8f0ff;" rowspan="2">{{result2}}</td>
            </tr>
            <tr>
                <td style="padding: 5px 10px; border: 1px solid #333;">Vibração final 2</td>
                <td style="padding: 5px 10px; border: 1px solid #333;">{{final2}}</td>
            </tr>
            </tbody>
        </table>
    </div>
  </div>
  
<div style="margin-top: 10px;">
  <div style="background: rgb(1, 153, 157); padding: 10px 32px; border-radius: 2px; margin-bottom: 10px; color: #fff; text-align: center;">
    <div style="font-size: 16px; font-weight: bold;">Gráfico antes e depois [VIBRAÇÃO]</div>
  </div>
  <div style="text-align: center;">
    {{chartImage}}
  </div>
</div>


  <!-- Fotos da máquina -->
    {{photos}}
   </div>
</body>
</html>
`;