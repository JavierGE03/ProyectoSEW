<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

// --- Configuración y clases ---
class DB {
    private $pdo;
    public function __construct() {
        try {
            $this->pdo = new PDO(
                'mysql:host=localhost;dbname=reservas;charset=utf8',
                'DBUSER2025',
                'DBPWD2025',
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch (PDOException $e) {
            die('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Error</title></head><body><p>No se puede conectar con la base de datos. Inténtelo más tarde.</p></body></html>');
        }
    }
    public function getPDO() {
        return $this->pdo;
    }
}

class Usuario {
    private $db;
    public function __construct($db) { $this->db = $db; }
    public function registrar($nombre, $apellidos, $email, $password) {
        $stmt = $this->db->prepare("INSERT INTO usuarios (nombre, apellidos, email, password) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$nombre, $apellidos, $email, password_hash($password, PASSWORD_DEFAULT)]);
    }
    public function login($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email=?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['usuario'] = $user['id_usuario'];
            return true;
        }
        return false;
    }
    public function actual() {
        return $_SESSION['usuario'] ?? null;
    }
    public function logout() {
        session_destroy();
        header("Location: reservas.php");
        exit;
    }
}

class Recurso {
    private $db;
    public function __construct($db) { $this->db = $db; }
    public function listar() {
        $sql = "SELECT r.*, t.nombre_tipo FROM recursos_turisticos r JOIN tipos_recurso t ON r.id_tipo = t.id_tipo";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtener($id) {
        $stmt = $this->db->prepare("SELECT * FROM recursos_turisticos WHERE id_recurso=?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

class Reserva {
    private $db;
    public function __construct($db) { $this->db = $db; }
   public function reservar($id_usuario, $id_recurso, $personas, $fecha_inicio, $fecha_fin, $observaciones = '') {
        try {
            $recurso = (new Recurso($this->db))->obtener($id_recurso);
            if (!$recurso) return false;
            
            $presupuesto = $recurso['precio'] * $personas;
            
            $this->db->beginTransaction();
            
            $stmt = $this->db->prepare("INSERT INTO reservas (id_usuario, id_recurso, fecha_inicio, fecha_fin, presupuesto, estado) 
                VALUES (?, ?, ?, ?, ?, 'confirmada')");
            $stmt->execute([$id_usuario, $id_recurso, $fecha_inicio, $fecha_fin, $presupuesto]);
            
            $id_reserva = $this->db->lastInsertId();
            
            $stmt2 = $this->db->prepare("INSERT INTO detalle_reserva (id_reserva, cantidad_personas, observaciones) 
                VALUES (?, ?, ?)");
            $stmt2->execute([$id_reserva, $personas, $observaciones]);
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            error_log("Error en reserva: " . $e->getMessage());
            return false;
        }
    }
    public function listarPorUsuario($id_usuario) {
        $sql = "SELECT r.id_reserva, rt.nombre, rt.descripcion, r.presupuesto, r.estado, d.cantidad_personas
                FROM reservas r
                JOIN recursos_turisticos rt ON r.id_recurso = rt.id_recurso
                JOIN detalle_reserva d ON r.id_reserva = d.id_reserva
                WHERE r.id_usuario = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id_usuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function anular($id_reserva, $id_usuario) {
        $stmt = $this->db->prepare("UPDATE reservas SET estado='anulada' WHERE id_reserva=? AND id_usuario=?");
        return $stmt->execute([$id_reserva, $id_usuario]);
    }
}

// --- Lógica de la página ---
$db = (new DB())->getPDO();
$usuario = new Usuario($db);
$recurso = new Recurso($db);
$reserva = new Reserva($db);

$msg = "";

// Registro de usuario
if (isset($_POST['registro'])) {
    if ($usuario->registrar($_POST['nombre'], $_POST['apellidos'], $_POST['email'], $_POST['password'])) {
        $msg = "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
    } else {
        $msg = "Error al registrar usuario.";
    }
}

// Login
if (isset($_POST['login'])) {
    if ($usuario->login($_POST['email'], $_POST['password'])) {
        $msg = "Sesión iniciada.";
    } else {
        $msg = "Usuario o contraseña incorrectos.";
    }
}

// Logout
if (isset($_POST['logout'])) {
    $usuario->logout();
}

// Reserva
if (isset($_POST['reservar']) && $usuario->actual()) {
    if ($reserva->reservar(
        $usuario->actual(), 
        $_POST['id_recurso'],
        $_POST['personas'],
        $_POST['fecha_inicio'],
        $_POST['fecha_fin'],
        $_POST['observaciones'] ?? ''
    )) {
        $msg = "Reserva realizada correctamente.";
    } else {
        $msg = "Error al realizar la reserva.";
    }
}

// Anulación
if (isset($_POST['anular']) && $usuario->actual()) {
    if ($reserva->anular($_POST['id_reserva'], $usuario->actual())) {
        $msg = "Reserva anulada.";
    } else {
        $msg = "No se pudo anular la reserva.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservas - Gijón</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css">
    <link rel="stylesheet" type="text/css" href="estilo/layout.css">
    <link rel="icon" type="image/png" href="multimedia/icono.png">
</head>
<body>
    <nav>
        <ul>
            <li><a href="index.html">Página principal</a></li>
            <li><a href="gastronomia.html">Gastronomía</a></li>
            <li><a href="rutas.html">Rutas</a></li>
            <li><a href="meteorologia.html">Meteorología</a></li>
            <li><a href="juego.html">Juego</a></li>
            <li><a href="reservas.php" class="active">Reservas</a></li>
            <li><a href="ayuda.html">Ayuda</a></li>
        </ul>
    </nav>
    <main>
        <h1>Central de Reservas Turísticas</h1>
        <p><?php echo htmlspecialchars($msg); ?></p>
        <?php if (!$usuario->actual()): ?>
        <section>
            <h2>Registro de usuario</h2>
            <form method="post" autocomplete="off">
                <label>Nombre <input type="text" name="nombre" placeholder="Nombre" required autocomplete="off"></label>
                <label>Apellidos <input type="text" name="apellidos" placeholder="Apellidos" required autocomplete="off"></label>
                <label>Email <input type="email" name="email" placeholder="Email" required autocomplete="off"></label>
                <label>Contraseña <input type="password" name="password" placeholder="Contraseña" required autocomplete="new-password"></label>
                <button type="submit" name="registro">Registrarse</button>
            </form>
        </section>
        <section>
            <h2>Iniciar sesión</h2>
            <form method="post" autocomplete="off">
                <label>Email <input type="email" name="email" placeholder="Email" required autocomplete="off"></label>
                <label>Contraseña <input type="password" name="password" placeholder="Contraseña" required autocomplete="new-password"></label>
                <button type="submit" name="login">Entrar</button>
            </form>
        </section>
        <?php else: ?>
        <form method="post"><button type="submit" name="logout">Cerrar sesión</button></form>
        <section>
            <h2>Reservar recurso turístico</h2>
            <form method="post" autocomplete="off">
                <label>Recurso:
                    <select name="id_recurso" required autocomplete="off">
                        <?php foreach ($recurso->listar() as $r): ?>
                        <option value="<?php echo $r['id_recurso']; ?>">
                            <?php echo htmlspecialchars($r['nombre']); ?> 
                            (<?php echo htmlspecialchars($r['nombre_tipo']); ?>) - 
                            <?php echo $r['plazas']; ?> plazas - 
                            <?php echo $r['precio']; ?>€
                        </option>
                        <?php endforeach; ?>
                    </select>
                </label>
                <label>Fecha de inicio:
                    <input type="datetime-local" name="fecha_inicio" required>
                </label>
                <label>Fecha de fin:
                    <input type="datetime-local" name="fecha_fin" required>
                </label>
                <label>Personas:
                    <input type="number" name="personas" min="1" max="20" required>
                </label>
                <label>Observaciones:
                    <textarea name="observaciones" rows="4" maxlength="255" 
                        placeholder="Añada aquí cualquier comentario o requisito especial"></textarea>
                </label>
                <button type="submit" name="reservar">Reservar</button>
            </form>
        </section>
        <section>
            <h2>Mis reservas</h2>
            <table>
                <tr>
                    <th>Recurso</th>
                    <th>Descripción</th>
                    <th>Personas</th>
                    <th>Presupuesto</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                <?php foreach ($reserva->listarPorUsuario($usuario->actual()) as $r): ?>
                <tr>
                    <td><?php echo htmlspecialchars($r['nombre']); ?></td>
                    <td><?php echo htmlspecialchars($r['descripcion']); ?></td>
                    <td><?php echo $r['cantidad_personas']; ?></td>
                    <td><?php echo $r['presupuesto']; ?>€</td>
                    <td><?php echo $r['estado']; ?></td>
                    <td>
                        <?php if ($r['estado'] !== 'anulada'): ?>
                        <form method="post" style="display:inline">
                            <input type="hidden" name="id_reserva" value="<?php echo $r['id_reserva']; ?>">
                            <button type="submit" name="anular">Anular</button>
                        </form>
                        <?php else: ?>
                        Anulada
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </section>
        <?php endif; ?>
    </main>
</body>
</html>