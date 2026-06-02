param(
  [Parameter(Mandatory = $true)]
  [string]$CsvPath,

  [string]$OutputPath = "reports\microdados-cursos-2024-report.html"
)

Add-Type -AssemblyName Microsoft.VisualBasic

function New-Group {
  [ordered]@{
    Records = 0L
    CourseUnits = 0L
    Vacancies = 0L
    Applicants = 0L
    Entrants = 0L
    Enrollments = 0L
    Graduates = 0L
  }
}

function To-Long([string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return 0L }
  $clean = $Value.Trim().Replace('"', '')
  $result = 0L
  if ([long]::TryParse($clean, [ref]$result)) { return $result }
  return 0L
}

function Add-Group($Table, [string]$Key, $Row) {
  if ([string]::IsNullOrWhiteSpace($Key)) { $Key = "Not informed" }
  if (-not $Table.ContainsKey($Key)) { $Table[$Key] = New-Group }
  $group = $Table[$Key]
  $group.Records += 1
  $group.CourseUnits += To-Long $Row.QT_CURSO
  $group.Vacancies += To-Long $Row.QT_VG_TOTAL
  $group.Applicants += To-Long $Row.QT_INSCRITO_TOTAL
  $group.Entrants += To-Long $Row.QT_ING
  $group.Enrollments += To-Long $Row.QT_MAT
  $group.Graduates += To-Long $Row.QT_CONC
}

function Label-Code([string]$Value, $Map) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return "Not informed" }
  if ($Map.ContainsKey($Value)) { return $Map[$Value] }
  return "Code $Value"
}

function Format-Number($Value) {
  return ([long]$Value).ToString("N0")
}

function HtmlEncode($Value) {
  return [System.Net.WebUtility]::HtmlEncode([string]$Value)
}

function Group-Rows($Table, [int]$Limit = 12) {
  $Table.GetEnumerator() |
    Sort-Object { $_.Value.Enrollments } -Descending |
    Select-Object -First $Limit |
    ForEach-Object {
      "<tr><td>$(HtmlEncode $_.Key)</td><td>$(Format-Number $_.Value.Records)</td><td>$(Format-Number $_.Value.CourseUnits)</td><td>$(Format-Number $_.Value.Vacancies)</td><td>$(Format-Number $_.Value.Applicants)</td><td>$(Format-Number $_.Value.Entrants)</td><td>$(Format-Number $_.Value.Enrollments)</td><td>$(Format-Number $_.Value.Graduates)</td></tr>"
    }
}

$organizationMap = @{
  "1" = "University"
  "2" = "University center"
  "3" = "Faculty"
  "4" = "Federal institute / CEFET"
}

$networkMap = @{
  "1" = "Public"
  "2" = "Private"
}

$categoryMap = @{
  "1" = "Public federal"
  "2" = "Public state"
  "3" = "Public municipal"
  "4" = "Private for-profit"
  "5" = "Private non-profit"
  "7" = "Special"
}

$modalityMap = @{
  "1" = "On-campus"
  "2" = "Distance education"
}

$levelMap = @{
  "1" = "Undergraduate"
  "2" = "Sequential"
}

$degreeMap = @{
  "1" = "Bachelor"
  "2" = "Licentiate"
  "3" = "Technologist"
  "4" = "Bachelor and licentiate"
}

$byRegion = @{}
$byState = @{}
$byModality = @{}
$byNetwork = @{}
$byOrganization = @{}
$byCategory = @{}
$byLevel = @{}
$byDegree = @{}
$byArea = @{}
$byCourse = @{}

$total = New-Group
$rowCount = 0L
$sampleRows = New-Object System.Collections.Generic.List[object]

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($CsvPath, [System.Text.Encoding]::UTF8)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(";")
$parser.HasFieldsEnclosedInQuotes = $true

try {
  $headers = $parser.ReadFields()
  while (-not $parser.EndOfData) {
    $fields = $parser.ReadFields()
    if ($null -eq $fields) { continue }

    $row = @{}
    for ($i = 0; $i -lt $headers.Length; $i++) {
      $row[$headers[$i]] = if ($i -lt $fields.Length) { $fields[$i] } else { "" }
    }

    $rowCount++
    Add-Group $byRegion $row.NO_REGIAO $row
    Add-Group $byState "$($row.SG_UF) - $($row.NO_UF)" $row
    Add-Group $byModality (Label-Code $row.TP_MODALIDADE_ENSINO $modalityMap) $row
    Add-Group $byNetwork (Label-Code $row.TP_REDE $networkMap) $row
    Add-Group $byOrganization (Label-Code $row.TP_ORGANIZACAO_ACADEMICA $organizationMap) $row
    Add-Group $byCategory (Label-Code $row.TP_CATEGORIA_ADMINISTRATIVA $categoryMap) $row
    Add-Group $byLevel (Label-Code $row.TP_NIVEL_ACADEMICO $levelMap) $row
    Add-Group $byDegree (Label-Code $row.TP_GRAU_ACADEMICO $degreeMap) $row
    Add-Group $byArea $row.NO_CINE_AREA_GERAL $row
    Add-Group $byCourse $row.NO_CURSO $row

    $total.Records += 1
    $total.CourseUnits += To-Long $row.QT_CURSO
    $total.Vacancies += To-Long $row.QT_VG_TOTAL
    $total.Applicants += To-Long $row.QT_INSCRITO_TOTAL
    $total.Entrants += To-Long $row.QT_ING
    $total.Enrollments += To-Long $row.QT_MAT
    $total.Graduates += To-Long $row.QT_CONC

    if ($sampleRows.Count -lt 8) {
      $sampleRows.Add([pscustomobject]@{
        Region = $row.NO_REGIAO
        State = $row.SG_UF
        Municipality = $row.NO_MUNICIPIO
        Course = $row.NO_CURSO
        Area = $row.NO_CINE_AREA_GERAL
        Modality = Label-Code $row.TP_MODALIDADE_ENSINO $modalityMap
        Enrollments = To-Long $row.QT_MAT
      })
    }
  }
}
finally {
  $parser.Close()
}

$sampleHtml = $sampleRows | ForEach-Object {
  "<tr><td>$(HtmlEncode $_.Region)</td><td>$(HtmlEncode $_.State)</td><td>$(HtmlEncode $_.Municipality)</td><td>$(HtmlEncode $_.Course)</td><td>$(HtmlEncode $_.Area)</td><td>$(HtmlEncode $_.Modality)</td><td>$(Format-Number $_.Enrollments)</td></tr>"
}

$generatedAt = Get-Date -Format "yyyy-MM-dd HH:mm"
$sourceName = Split-Path $CsvPath -Leaf
$sourceSizeMb = [math]::Round((Get-Item $CsvPath).Length / 1MB, 1)

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Brazil Higher Education Courses 2024 - Styled Report</title>
  <style>
    :root { --ink:#15202b; --muted:#667085; --line:#e6eaf0; --green:#0f8a5f; --yellow:#f7c948; --blue:#246bfd; --soft:#f6f8fb; }
    * { box-sizing: border-box; }
    body { margin:0; color:var(--ink); background:#ffffff; font-family: Inter, Segoe UI, Arial, sans-serif; line-height:1.55; }
    .bar { height:6px; background:linear-gradient(90deg,var(--green),var(--yellow),var(--blue)); }
    .wrap { max-width:1180px; margin:0 auto; padding:34px 24px 64px; }
    header { border-bottom:1px solid var(--line); padding-bottom:26px; margin-bottom:28px; }
    .eyebrow { color:var(--green); font-size:13px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
    h1 { margin:8px 0 10px; font-size:40px; line-height:1.08; letter-spacing:-.02em; }
    h2 { margin:34px 0 14px; font-size:24px; }
    h3 { margin:22px 0 10px; font-size:18px; }
    p { color:var(--muted); max-width:860px; }
    .meta { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
    .pill { border:1px solid var(--line); background:var(--soft); border-radius:999px; padding:7px 12px; color:#344054; font-size:13px; font-weight:700; }
    .cards { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin:24px 0 10px; }
    .card { border:1px solid var(--line); border-radius:10px; padding:18px; background:#fff; box-shadow:0 12px 32px rgba(21,32,43,.05); }
    .label { color:var(--muted); font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
    .value { margin-top:8px; font-size:28px; font-weight:900; }
    table { width:100%; border-collapse:collapse; margin:12px 0 24px; overflow:hidden; border:1px solid var(--line); border-radius:10px; }
    th,td { padding:11px 12px; border-bottom:1px solid var(--line); text-align:right; font-size:13px; vertical-align:top; }
    th:first-child, td:first-child { text-align:left; min-width:220px; }
    th { background:#f8fafc; color:#475467; font-size:12px; text-transform:uppercase; letter-spacing:.04em; }
    tr:last-child td { border-bottom:0; }
    .note { border-left:4px solid var(--green); background:#f6fbf8; padding:14px 16px; border-radius:8px; color:#344054; }
    .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
    footer { margin-top:38px; padding-top:20px; border-top:1px solid var(--line); color:var(--muted); font-size:13px; }
    @media (max-width: 900px) { .cards,.grid2 { grid-template-columns:1fr; } h1 { font-size:30px; } table { display:block; overflow-x:auto; } }
  </style>
</head>
<body>
  <div class="bar"></div>
  <main class="wrap">
    <header>
      <div class="eyebrow">Styled data report</div>
      <h1>Brazil Higher Education Courses 2024</h1>
      <p>A clean, labelled summary generated from the official course registration microdata CSV. The report focuses on searchable, decision-friendly indicators: courses, vacancies, applicants, entrants, enrollments, and graduates.</p>
      <div class="meta">
        <span class="pill">Source: $(HtmlEncode $sourceName)</span>
        <span class="pill">Size: $sourceSizeMb MB</span>
        <span class="pill">Generated: $generatedAt</span>
        <span class="pill">Delimiter: semicolon</span>
      </div>
    </header>

    <section>
      <h2>National Overview</h2>
      <div class="cards">
        <div class="card"><div class="label">CSV records</div><div class="value">$(Format-Number $total.Records)</div></div>
        <div class="card"><div class="label">Course units</div><div class="value">$(Format-Number $total.CourseUnits)</div></div>
        <div class="card"><div class="label">Total vacancies</div><div class="value">$(Format-Number $total.Vacancies)</div></div>
        <div class="card"><div class="label">Total enrollments</div><div class="value">$(Format-Number $total.Enrollments)</div></div>
      </div>
      <div class="cards">
        <div class="card"><div class="label">Applicants</div><div class="value">$(Format-Number $total.Applicants)</div></div>
        <div class="card"><div class="label">Entrants</div><div class="value">$(Format-Number $total.Entrants)</div></div>
        <div class="card"><div class="label">Graduates</div><div class="value">$(Format-Number $total.Graduates)</div></div>
        <div class="card"><div class="label">Year</div><div class="value">2024</div></div>
      </div>
    </section>

    <section>
      <h2>How to Read the Labels</h2>
      <p class="note">The CSV uses compact official field codes. This document expands the most important ones into readable labels. Blank geographic fields are shown as "Not informed" because some aggregate records in the file do not include municipality or state-level descriptors.</p>
    </section>

    <section>
      <h2>Breakdown by Region</h2>
      <table><thead><tr><th>Region</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byRegion 20) -join "`n")
      </tbody></table>
    </section>

    <section>
      <h2>Top States by Enrollments</h2>
      <table><thead><tr><th>State</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byState 15) -join "`n")
      </tbody></table>
    </section>

    <div class="grid2">
      <section>
        <h2>Teaching Modality</h2>
        <table><thead><tr><th>Modality</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
        $((Group-Rows $byModality 10) -join "`n")
        </tbody></table>
      </section>
      <section>
        <h2>Academic Network</h2>
        <table><thead><tr><th>Network</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
        $((Group-Rows $byNetwork 10) -join "`n")
        </tbody></table>
      </section>
    </div>

    <section>
      <h2>Institution Type and Administration</h2>
      <h3>Academic organization</h3>
      <table><thead><tr><th>Organization</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byOrganization 10) -join "`n")
      </tbody></table>
      <h3>Administrative category</h3>
      <table><thead><tr><th>Category</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byCategory 12) -join "`n")
      </tbody></table>
    </section>

    <section>
      <h2>Academic Level and Degree</h2>
      <div class="grid2">
        <div>
          <h3>Academic level</h3>
          <table><thead><tr><th>Level</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
          $((Group-Rows $byLevel 10) -join "`n")
          </tbody></table>
        </div>
        <div>
          <h3>Degree type</h3>
          <table><thead><tr><th>Degree</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
          $((Group-Rows $byDegree 10) -join "`n")
          </tbody></table>
        </div>
      </div>
    </section>

    <section>
      <h2>Top CINE Areas by Enrollments</h2>
      <table><thead><tr><th>CINE general area</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byArea 15) -join "`n")
      </tbody></table>
    </section>

    <section>
      <h2>Top Course Names by Enrollments</h2>
      <table><thead><tr><th>Course name</th><th>Records</th><th>Course units</th><th>Vacancies</th><th>Applicants</th><th>Entrants</th><th>Enrollments</th><th>Graduates</th></tr></thead><tbody>
      $((Group-Rows $byCourse 20) -join "`n")
      </tbody></table>
    </section>

    <section>
      <h2>Sample Records</h2>
      <table><thead><tr><th>Region</th><th>State</th><th>Municipality</th><th>Course</th><th>Area</th><th>Modality</th><th>Enrollments</th></tr></thead><tbody>
      $($sampleHtml -join "`n")
      </tbody></table>
    </section>

    <footer>
      Generated by StudyinBrazil tooling from the provided 2024 course microdata CSV. This is a summarized report; use the original CSV for row-level auditing.
    </footer>
  </main>
</body>
</html>
"@

$resolvedOutput = Join-Path (Get-Location) $OutputPath
$outputDir = Split-Path $resolvedOutput -Parent
New-Item -ItemType Directory -Force $outputDir | Out-Null
[System.IO.File]::WriteAllText($resolvedOutput, $html, [System.Text.Encoding]::UTF8)

Write-Output "Report generated: $resolvedOutput"
Write-Output "Records processed: $(Format-Number $rowCount)"
