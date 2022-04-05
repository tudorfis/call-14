<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'config.php'; 

$conn = mysqli_connect( $host, $user, $pass, $db );
$api = new Api( $conn );

if ( isset($_POST['method']) ) {
    $api->{$_POST['method']}();
}

if ( isset($_GET['method']) ) {
    $api->{$_GET['method']}();
}

class Api {
    protected $conn;

    function __construct( $conn ) {
        $this->conn = $conn;
    }

    // get
    public function login() {
        $email = $_GET['params']['email'];
        $password = $_GET['params']['password'];

        $query = "select * from users where email = '". $email ."' and password = '". $password ."'";
        $result = mysqli_query( $this->conn, $query );
    
        if ($result->num_rows > 0) {
            $row = mysqli_fetch_assoc($result);
            echo json_encode( array( 'token' => $row['token'] ) );
            return;
        }

        echo json_encode( array( 'token' => '' ) );
    }

    public function checkLogin() {
        $token = $_GET['params']['token'];

        $query = "select * from users where token = '". $token ."'";
        $result = mysqli_query( $this->conn, $query );
    
        $valid = $result->num_rows > 0;
        echo json_encode( array( 'valid' => $valid ) );
    }

    // post
    public function saveElev() {
        $query = "insert into elevi (
            nume, 
            prenume, 
            clasa, 
            anul
        )
        VALUES (
            '".$_POST['nume']."', 
            '".$_POST['prenume']."', 
            '".$_POST['clasa']."', 
            '".$_POST['anul']."'
        )";

        $success = mysqli_query($this->conn, $query);
        echo json_encode( array( 'success' => $success ) );
    }
}

